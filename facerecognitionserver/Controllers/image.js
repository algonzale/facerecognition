const Clarifai = require('clarifai'); 

const app = new Clarifai.App({
  apiKey: '3bda195318d94327a103f81946e39fb4'
 });
 
 const handleAPI =(req, res)=> {
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => res.json(data))
  .catch(err => res.status(400).json('Error handling image'))
 }

const handleImageSubmit =(req, res, db)=> {
	const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
}

module.exports = {
    handleImageSubmit,
    handleAPI
}