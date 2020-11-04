SELECT CONCAT(emp1.first_name,' ', emp1.last_name) AS employee_name, role.title, CONCAT(mgr.first_name,' ', mgr.last_name) AS manager_name FROM employee emp1
INNER JOIN role
ON (role.id=emp1.role_id)
LEFT OUTER JOIN employee mgr
ON (mgr.id=emp1.manager_id)
ORDER BY manager_name, employee_name