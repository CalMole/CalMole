pool.query(
    "INSERT INTO company (id, firstname, lastname, email) VALUES(default, 'givenName', 'familyName' , 'emails'[0])",
    (err, res) => {
      console.log(err, res);
      pool.end();
    }
  );

  company.getUser = (req, res, next) => {
   
    const Users ={}
    db.query(Users)
      .then((result) => {
        res.locals = Users;
        return next();
      })
      .catch((err) => next(err));
  };