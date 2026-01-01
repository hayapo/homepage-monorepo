import { useEffect, useState } from "react";

export const Header = () => {
	return (
		<header
			style={{
				height: "60px",
				padding: "1rem",
				borderBottom: "1px solid #ccc",
				display: "flex",
				justifyContent: "space-between",
			}}
		>
			<h1>
				<a href="/">hayapo.dev</a>
			</h1>
		</header>
	);
};
