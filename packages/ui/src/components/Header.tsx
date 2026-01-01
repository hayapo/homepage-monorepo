import styles from "./header.module.css";

export const Header = () => {
	return (
		<div className={styles.header}>
			<h1 className={styles.title}>
				<a className={styles.link} href="/">
					hayapo.dev
				</a>
			</h1>
		</div>
	);
};
