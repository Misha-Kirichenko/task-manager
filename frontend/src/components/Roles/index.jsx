import {
	Box,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup
} from "@mui/material";

const Roles = () => (
	<Box sx={{ margin: "20px 0" }}>
		<FormControl>
			<FormLabel id="demo-radio-buttons-group-label">I am</FormLabel>
			<RadioGroup
				aria-labelledby="demo-radio-buttons-group-label"
				value="Value"
				name="radio-buttons-group"
			>
				<FormControlLabel value="manager" control={<Radio />} label="Manager" />
				<FormControlLabel value="user" control={<Radio />} label="User" />
				<FormControlLabel value="admin" control={<Radio />} label="Admin" />
			</RadioGroup>
		</FormControl>
	</Box>
);

export default Roles;
