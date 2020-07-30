const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const School = require('node-school-kr');
const school = new School();
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

let year;
let month;
let day;
let se;
const getDate = () => {
    let date = moment();
    year = date.format('YYYY');
    month = date.format('MM');
    day = date.format('DD');
    se = date.format('ss');
};
let meal = "";
const example = async function() {
    school.init(School.Type.HIGH, School.Region.SEOUL, 'B100000659');

    meal = await school.getMeal({
        year: year,
        month: month,
        default: '급식이 없습니다'
    });
};
example();

const apiRouter = express.Router();



app.use(logger('dev', {}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api', apiRouter);

apiRouter.get('/test', function (req, res) {
    res.send('Hello');
});
apiRouter.post('/today', function(req, res) {
    getDate();
    let str = meal.today==null ? "급식이 없습니다":meal.today;
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: '오늘 급식\n'+str
                    }
                }
            ]
        }
    };

    res.status(200).send(responseBody);
});

apiRouter.post('/tomorrow', function(req, res) {
    getDate();
    var day = moment().add(1,'days').format('DD');
    let str = meal[day]==null ? "급식이 없습니다":meal[day];
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: '내일 급식\n'+str
                    }
                }
            ]
        }
    };

    res.status(200).send(responseBody);
});

apiRouter.post('/info', function(req, res) {
    getDate();
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: '세명컴고 급식봇\n개발:30114 이용빈\n오늘날짜 : '+month+'/'+day+'/'+se
                    }
                }
            ]
        }
    };

    res.status(200).send(responseBody);
});



var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('server on');
});