const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try{
    const headId = req.language.head;
    const head = await LanguageService.getWordById(req.app.get('db'), headId);

     res.json({
      nextWord: head.original,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count,
      totalScore: req.language.total_score
     })
     next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try{
      const {guess} = req.body;
      const {language} =req;

      if (!guess)
        return res.status(400).json({
          error: `Missing 'guess' in request body`
        });

      const head = await LanguageService.getWordById(req.app.get('db'), language.head);
      const nextWord = await LanguageService.getWordById(req.app.get('db'), head.next);
      const isCorrect = guess === head.translation ? true : false;

      if(isCorrect){
        head.correct_count = head.correct_count + 1;
        head.memory_value = head.memory_value * 2;
        language.total_score = language.total_score + 1;
      } 
      else {
        head.incorrect_count = head.incorrect_count + 1;
        head.memory_value = 1;
      }

      const traversetoMemoryValue= await getNthMemory(req.app.get('db'),  head, head.memory_value);
      head.next = traversetoMemoryValue.next;
      traversetoMemoryValue.next = head.id;
      language.head = nextWord.id;

      LanguageService.updateWordPointer(req.app.get('db'), head)
      .then(() => next())
      LanguageService.updateWordPointer(req.app.get('db'), traversetoMemoryValue)
        .then(() => next())
      LanguageService.updateHead(req.app.get('db'), language)
        .then(() => next())
   
      res.json({
        isCorrect,
        nextWord: nextWord.original,
        totalScore: language.total_score,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        answer: head.translation
      })
    } catch (error) {
        next (error)
    }
  })

  async function  getNthMemory (db, node, nth, result = 0){
    if(node.next === null | nth === result)
      return node;
    const head = await LanguageService.getWordById(db, node.next);
    return getNthMemory(db, head, nth, result + 1);
  } 

module.exports = languageRouter
