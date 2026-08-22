import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import { APPLICATION_STAGES } from '../models/Application.js';

// Dashboard numbers: totals, response rate, and a count per stage.
export async function getPipelineStats(req, res, next) {
  try {
    const [byStage, totals, interviewCount] = await Promise.all([
      Application.aggregate([
        {
          $group: {
            _id: '$stage',
            count: { $sum: 1 },
            averagePriority: { $avg: '$priority' }
          }
        }
      ]),
      Application.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            averageSalaryExpectation: { $avg: '$salaryExpectation' }
          }
        }
      ]),
      Interview.countDocuments()
    ]);

    const stageMap = Object.fromEntries(byStage.map((row) => [row._id, row]));

    // Always return every stage so the bars do not jump around when one is empty.
    const stages = APPLICATION_STAGES.map((stage) => ({
      stage,
      count: stageMap[stage]?.count ?? 0,
      averagePriority: stageMap[stage]
        ? Number(stageMap[stage].averagePriority.toFixed(2))
        : null
    }));

    const total = totals[0]?.total ?? 0;
    const rejected = stageMap.rejected?.count ?? 0;
    const offers = stageMap.offer?.count ?? 0;
    const active = total - rejected;

    res.json({
      total,
      active,
      offers,
      interviewCount,
      responseRate: total === 0 ? 0 : Number((((total - (stageMap.wishlist?.count ?? 0) - (stageMap.applied?.count ?? 0)) / total) * 100).toFixed(1)),
      averageSalaryExpectation: totals[0]?.averageSalaryExpectation
        ? Math.round(totals[0].averageSalaryExpectation)
        : null,
      stages
    });
  } catch (err) {
    next(err);
  }
}

// Applications grouped by company — useful for spotting where effort piles up.
export async function getCompanyBreakdown(req, res, next) {
  try {
    const breakdown = await Application.aggregate([
      {
        $group: {
          _id: '$companyId',
          applications: { $sum: 1 },
          highestPriority: { $max: '$priority' }
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' },
      {
        $project: {
          _id: 0,
          companyId: '$_id',
          company: '$company.name',
          industry: '$company.industry',
          applications: 1,
          highestPriority: 1
        }
      },
      { $sort: { applications: -1, company: 1 } }
    ]);

    res.json(breakdown);
  } catch (err) {
    next(err);
  }
}
