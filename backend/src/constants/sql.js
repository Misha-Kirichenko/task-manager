const SQL_USER_PROJECT_LIST = `
							SELECT
								p.id AS "projectId",
								p."projectName",
								p."startDate"
								CONCAT(u.name, ' ', u.surname) AS manager
							FROM user_projects u_p
							INNER JOIN projects p ON u_p."projectId" = p.id
							LEFT JOIN users u ON p."managerId" = u.id
							WHERE u_p."userId" = $1 AND p."endDate" = 0 
							ORDER BY p."startDate" DESC;`;

const SQL_USERS_WITH_ASSIGNED_FLAG = `SELECT
									u.id AS "userId",
									CONCAT(u.name, ' ', u.surname) AS user,
									 JSON_BUILD_OBJECT(
                                        'date', TO_CHAR(TO_TIMESTAMP(u."lastLogin" / 1000), 'DD/MM/YYYY'),
                                        'time', TO_CHAR(TO_TIMESTAMP(u."lastLogin" / 1000), 'HH24:MI')
                                    ) AS "lastLogin",
									CASE 
										WHEN u_p."projectId" IS NULL THEN false
										ELSE true
									END AS assigned
								FROM users u
								LEFT JOIN user_projects u_p 
									ON u.id = u_p."userId" AND u_p."projectId" = $1
								WHERE u.role = 'USER'
								ORDER BY assigned DESC, u."lastLogin" DESC;`;

module.exports = {
	SQL_USER_PROJECT_LIST,
	SQL_USERS_WITH_ASSIGNED_FLAG
};
