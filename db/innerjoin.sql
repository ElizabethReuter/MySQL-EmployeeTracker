SELECT role.title, role.salary, department.name FROM role
INNER JOIN department
ON (department.id=role.department_id)
ORDER BY department.name, role.title 