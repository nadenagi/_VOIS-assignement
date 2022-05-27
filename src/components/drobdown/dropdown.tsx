import React from "react";
import styles from "./dropdown.module.css";
import useComponentVisible from "../../hooks/clickOutsideHook";
type drobdownProps = {
  list: any;
  selectedItem: string;
  setSelectedItem: any;
};

const Drobdown: React.FC<drobdownProps> = ({
  list = [],
  selectedItem = "",
  setSelectedItem,
}) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const onCLick = () => {};

  return (
    <div
      data-testid="drobdown"
      ref={ref}
      className={`${
        isComponentVisible
          ? `${styles.drobdownContainer} ${styles.active}`
          : `${styles.drobdownContainer}`
      }`}
    >
      {selectedItem}
      <ul
        className={`${
          isComponentVisible
            ? `${styles.drobdown} active`
            : `${styles.drobdown}`
        }`}
      >
        {list?.map((item: any, index: number) => {
          return (
            <li
              className={styles.drobdownItem}
              key={`drobdown-${index}`}
              onClick={() => {
                setIsComponentVisible(false);
                setSelectedItem(item);
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Drobdown;
