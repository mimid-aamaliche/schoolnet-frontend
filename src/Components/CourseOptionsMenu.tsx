import styles from './CourseOptionsMenuStlye.module.css'


interface Option {
  value: number;
  label: string;
  icon?: React.ReactNode;
}



interface CourseOptionsMenuProps {
  
  title?: string;
  options: Option[];
  onSelect: (value: number) => void;

}



function CourseOptionsMenu({ options, onSelect, title = "Choose an option" }:CourseOptionsMenuProps){




    return (
    <div className={styles.menuContainer}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.optionGrid}>
        {options.map((opt) => (
          <button
            key={opt.value}
            className={styles.optionCard}
            onClick={() => onSelect(opt.value)}
          >
            <div className={styles.iconWrapper}>{opt.icon}</div>
            <span className={styles.label}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );





}

export default CourseOptionsMenu;