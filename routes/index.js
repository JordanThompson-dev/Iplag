var express = require('express');
var router = express.Router();
var {readFiles} = require("../services/file_reader"); 
var gst = require("../services/core/gst");
var Submissions = require("../models/files");
var fs = require("fs-promise");

router.get('/', async (req, res, next) => {
  const submissions = await Submissions.find({});

  res.render('index', { submissions });
});


router.get('/result',async (req, res, next)=>{

  const submission = await Submissions.findOne({"_id": req.query.sub});
  
  var files = [];

  for(let file of submission.files){
    let fname = file.name.split('.')[0] + '.json';
    const tokens =  await fs.readFile(`public/tokens/${fname}`, 'utf-8');
    files.push({
      filename: file.originalname,
      tokens
    })
  }


  let results = [];
  let minimumMatch = 5;

  for(let i=0; i<files.length - 1; i++){
    for(let j=i+1; j<files.length; j++){
      let f1 = files[i]['filename'];
      let f2 = files[j]['filename'];
      let ti = JSON.parse(files[i]['tokens']);
      let tj = JSON.parse(files[j]['tokens']);
      let sim = gst(ti['tokens'], tj['tokens'], minimumMatch);

      results.push({
        'file1': f1,
        'file2': f2,
        'similarity': sim,
        'plag': sim > 0.5,
        'gsim': sim * 1000000000
      })
    }
  }

  results.sort(function(a, b) {
    if (a.similarity > b.similarity) return -1;
    if (a.similarity < b.similarity) return 1;
    return 0;
  });


  res.render('results', {results});
})



module.exports = router;
