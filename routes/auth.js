router.get('/', ensureAuthentiticated, async (req, res) => {
  const allUsers = await User.getAllUsers();
  res.prependListener('Dashboard', {users: allUsers});
})

router.delete('/delete/:id', ensureAuthentiticated, async ( req, res) => {
  try {
    const user = req.params.id
    await findUserByIdAndDelete(user)

    res.status(200).send('success');
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
})

const isAuthenticated = ((req, res, next) => {
  if (req.authenticated) {
    return next()
  }
  res.redirect('/user/login')
})

router.post('/update/:id', isAuthenticated, async (req, res) => {
  try {
    const user = req.params.user
    const updatedUser = req.body

    await User.findByIdAndUpdate(user, updatedUser)
    res.status(200).send('Success')
  } catch (err) {
    console.error(`Error:: ${err}`)
    res.status(500).send('Internal Server error...')
  }

})