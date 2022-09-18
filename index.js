const httpServer = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');
var FinalArray = []

const tempCourse = fs.readFileSync(
    `${__dirname}/data/loanData.json`,
    'utf-8'
 );


const templateHTMLCourse = fs.readFileSync(
    `${__dirname}/template/templateCourse.html`,
    'utf-8'
  );

const dataObj = JSON.parse(tempCourse);

const server = httpServer.createServer( (req, res) =>{

   
    const {query,pathname} = url.parse(req.url, true);
    if(query.id){

        if (pathname === '/' || pathname.toLowerCase() === '/courses') {
            res.writeHead(200, {
                'Content-type': 'text/html'
            });

            const course = dataObj[Number(query.id)];
        
            const totalLoanAmt = function (course){

                var monthlyPayment = 250;
                var monthlyInterest = course.interest/1200;
                        
                var Numbermonth = course.loanTermYears * 12  ;
                        
                
                var sample = (1+ monthlyInterest);
                
                var target = 1-(1/(Math.pow(sample,Numbermonth)));
                
        
                var LoanAmount = (monthlyPayment/monthlyInterest)*(target)
                
                return LoanAmount;

           }
            const finalAmount = totalLoanAmt(course);
  

            let courseHTML = replaceTemplate(templateHTMLCourse, course);
            
            courseHTML = courseHTML.replace(/{%LOANAMOUNT%}/g, finalAmount);

            console.log(finalAmount)
            res.end(courseHTML);
            GrantTotal(finalAmount);
        }
    }
    else{
            res.writeHead(404, {
                'Content-type': 'text/html'
            });
            res.end(`resource not found`)
        }
    });
    const GrantTotal = () => {
        dataObj.forEach(function (item) {
    
            var monthlyPayment = 250;
            var monthlyInterest = item.interest / 1200;
    
            var Numbermonth = item.loanTermYears * 12;
    
            var sample = (1 + monthlyInterest);
            var target = 1 - (1 / (Math.pow(sample, Numbermonth)));
    
            var LoanAmount = (monthlyPayment / monthlyInterest) * (target)
    
            FinalArray.push(LoanAmount)
            return LoanAmount;
    
        })
    
        const initialValue = 0;
        const sumWithInitial = FinalArray.reduce(
            (a, b) => a + b,
            initialValue
        );
        console.log("!!!" + sumWithInitial.toFixed(2));
    
    }

//Start Listening to requests
server.listen(8000, 'localhost', ()=> {
    console.log('Listening to requests on port 8000');
});