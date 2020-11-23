const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const School = require('school-kr');
const school = new School();
const moment = require('moment');
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
    getDate();
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
    if(Number(day)<10) day = day.substring(1);
    let str = meal[day]==null ? "급식이 없습니다":meal[day];
    str = str.replace("&amp;","\n");
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: str
                    }
                }
            ]
        }
    };

    res.status(200).send(responseBody);
});

apiRouter.post('/tomorrow', function(req, res) {
    getDate();
    var day1 = moment().add(1,'days').format('DD');
    if(Number(day1)-Number(day)!==1){
        const responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: '내일급식은 달이 달라져서 지원되지 않습니다'
                        }
                    }
                ]
            }
        };

        res.status(200).send(responseBody);

    }else {
        if (Number(day1) < 10) day1 = day1.substring(1);
        let str = meal[day1] == null ? "급식이 없습니다" : meal[day1];
        str = str.replace("&amp;","\n");
        const responseBody = {
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: str
                        }
                    }
                ]
            }
        };

        res.status(200).send(responseBody);
    }
});

apiRouter.post('/info', function(req, res) {
    getDate();
    const responseBody = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: '세명컴고 급식봇\n개발: ???'
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
