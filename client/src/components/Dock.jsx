import { useRef, useState } from 'react';
import Icon from './Icon.jsx';

// Magnify icons near the cursor.
const FALLOFF_PX = 120;
const MAX_GROWTH = 0.6;

export default function Dock({ items }) {
  const [pointerX, setPointerX] = useState(null);
  const itemRefs = useRef([]);

  function scaleFor(index) {
    if (pointerX === null) return 1;

    const element = itemRefs.current[index];
    if (!element) return 1;

    const rect = element.getBoundingClientRect();
    const distance = Math.abs(pointerX - (rect.left + rect.width / 2));
    if (distance > FALLOFF_PX) return 1;

    return 1 + MAX_GROWTH * (1 - distance / FALLOFF_PX);
  }

  return (
    <div className="dock-wrap">
      <div
        className="dock"
        onMouseMove={(event) => setPointerX(event.clientX)}
        onMouseLeave={() => setPointerX(null)}
      >
        {items.map((item, index) => {
          const scale = scaleFor(index);

          return (
            <button
              key={item.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              className={`dock__item${item.active ? ' dock__item--active' : ''}`}
              style={{ transform: `scale(${scale.toFixed(3)}) translateY(${(-(scale - 1) * 16).toFixed(1)}px)` }}
              onClick={item.onClick}
              aria-label={item.label}
              aria-pressed={item.active}
            >
              <span className="dock__label">{item.label}</span>
              <Icon name={item.icon} size={19} />
              {item.badge > 0 && <span className="dock__badge">{item.badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
