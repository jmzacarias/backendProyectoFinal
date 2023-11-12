export const auth = (req, res, next) => {
	if (req.session.user?.role === "admin" || req.session.user?.role === "user") {
	  next();
	} else {
	  res.redirect("/");
	}
  };

export const isAuth = (req, res, next)=>{
	let user = req.session.user
    if(!user) {
      res.render('sessions/login')  
    }else{
     res.render('sessions/profile', {user})   
    }
}

