const SQL_USER_PROJECT_LIST = `
							SELECT
								p.id AS "projectId",
								p."projectName",
								p."startDate"
								CONCAT(u.name, ' ', u.surname) AS manager
							FROM user_projects u_p
							LEFT JOIN projects p ON u_p."projectId" = p.id
							LEFT JOIN users u ON p."managerId" = u.id
							WHERE u_p."userId" = $1 AND p."endDate" = 0 
							ORDER BY p."startDate" DESC`;

const SQL_ASSIGN_USERS = `
	INSERT INTO 
		user_projects ("userId", "projectId")
		SELECT u.id, $1 FROM users u WHERE u.id = ANY ($2) AND u.role != $3
	ON CONFLICT ("userId", "projectId") DO NOTHING;`;

const USERS_WITH_ASSIGNED_FLAG = `SELECT
									u.id AS "userId",
									TO_CHAR(u."lastLogin", 'DD/MM/YYYY HH24:MI') AS "lastLogin",
									CONCAT(u.name, ' ', u.surname) AS user,
									CASE 
										WHEN u_p."projectId" IS NULL THEN false
										ELSE true
									END AS assigned
								FROM users u
								LEFT JOIN user_projects u_p 
									ON u.id = u_p."userId" AND u_p."projectID" = $1
								WHERE u.role = 'USER';
								`;

module.exports = {
	SQL_USER_PROJECT_LIST,
	SQL_ASSIGN_USERS,
	USERS_WITH_ASSIGNED_FLAG
};
