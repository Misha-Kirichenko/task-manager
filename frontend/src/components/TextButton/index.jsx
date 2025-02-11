import Button from "@mui/material/Button";

const TextButton = ({ text, action }) => (
	<Button variant="outlined" onClick={action}>
		{text}
	</Button>
);

export default TextButton;
