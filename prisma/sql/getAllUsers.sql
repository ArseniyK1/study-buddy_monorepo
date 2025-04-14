SELECT a.*
FROM auth_user AS a
WHERE (
    $1::text = '' OR 
    a.first_name ~* $1::text OR 
    a.second_name ~* $1::text OR
    a.middle_name ~* $1::text
)
OFFSET $2
LIMIT $3