import styles from "./styles.module.css";

export default function CustomButton({ text }: { text: string }) {
  // This component creates a button with a snake-like animation for each letter in the text prop.
  return (
    <button className={`${styles.snakeButton} px-6 py-3 rounded-full border border-white transition morebtn`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={styles.letter}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </button>
  );
}
