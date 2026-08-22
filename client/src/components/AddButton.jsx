import Icon from './Icon.jsx';

// Split look, one real button underneath.
export default function AddButton({ onClick, label = 'Add application' }) {
  return (
    <button type="button" className="addbtn" onClick={onClick}>
      <span className="addbtn__label">{label}</span>
      <span className="addbtn__go">
        <Icon name="arrowUpRight" size={15} />
      </span>
    </button>
  );
}
