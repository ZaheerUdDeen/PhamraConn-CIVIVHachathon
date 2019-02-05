'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var cors = require('cors');
//create express web-app
const app = express();
const router = express.Router();

//get the libraries to call
var network = require('./network/network.js');


//bootstrap application settings
app.use(cors());
app.use(express.static('./public'));
app.use('/scripts', express.static(path.join(__dirname, '/public/scripts')));
app.use(bodyParser.json());

//get home page
app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

//get member page
app.get('/member', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/member.html'));
});

//get member registration page
app.get('/registerMember', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerMember.html'));
});

//get partner page
app.get('/partner', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/partner.html'));
});

//get partner registration page
app.get('/registerPartner', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerPartner.html'));
});

//get about page
app.get('/about', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/about.html'));
});


//post call to register member on the network
app.post('/api/registerDoctor', function(req, res) {

  //declare variables to retrieve from request
  var firstName=req.body.firstName;
  var lastName=req.body.lastName;
  var cardId=req.body.doctorId;
  var doctorId=req.body.doctorId;
  
  //print variables
  console.log('Using param - firstname: ' + firstName + ' lastname: ' + lastName + ' cardId: ' + cardId + ' doctorId: ' + doctorId );

        //else register member on the network
        network.registerDoctor(cardId, firstName, lastName, doctorId)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
});
//post call to register member on the network
app.post('/api/registerEmergencyDoctor', function(req, res) {

  //declare variables to retrieve from request
  var emergencyDoctorid=req.body.emergencyDoctorid;
  var licenceNumber=req.body.licenceNumber;
  var cardId=req.body.emergencyDoctorid;
  var authorizedDoctors=["A1B2aa444","B1B2aa444","C1B2aa444","D1B2aa444","E1B2aa444","F1B2aa444","G1B2aa444","H1B2aa444","I1B2aa444","J1B2aa444","J1B2aa444"]
      if(authorizedDoctors.indexOf(licenceNumber)>-1)
      {
        console.log("authorized Doctor-"+licenceNumber);
        //else register member on the network
        network.registerEmergencyDoctor(cardId, emergencyDoctorid, licenceNumber)
        .then((response) => {
          //return error if error in response
          if (response.error != null) {
            res.json({
              error: response.error
            });
          } else {
            //else return success
            res.json({
              success: response
            });
          }
        });
      }else{
        res.json({
          error: 'Unauthorized Person'
        });
      }
        
});
//post call to register member on the network
app.post('/api/registerPatient', function(req, res) {

  //declare variables to retrieve from request
  var firstName=req.body.firstName;
  var lastName=req.body.lastName;
  var address=req.body.address;
  var dateOfBirth=req.body.dateOfBirth
  var cardId=req.body.patientid;
  var patientid=req.body.patientid;
  var emergencyAccesTimeConstraints=req.body.emergencyAccesTimeConstraints
  
  //print variables
  console.log('Using param - firstname: ' + firstName + ' lastname: ' + lastName + ' cardId: ' + cardId + ' patientid: ' + patientid );

        //else register member on the network
        network.registerPatient(cardId, firstName, lastName,dateOfBirth,address, patientid,emergencyAccesTimeConstraints)
          .then((response) => {
            //return error if error in response
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //else return success
              res.json({
                success: response
              });
            }
          });
});

//post call to retrieve doctor Consultation
app.post('/api/getPatientData', function(req, res) {


  var patientid = req.body.patientid;
  var cardId = req.body.emergencyDoctorAccessCard;
  console.log('memberData using param - ' + ' PatientId: ' + patientid + ' cardId: ' + cardId);
  var returnData = {};
      //get UsePoints transactions from the network
      network.getPatientData(patientid,cardId)
        .then((resultConsultationData) => {
          //return error if error in response
          if (resultConsultationData.error != null) {
            res.json({
              error: resultConsultationData.error
            });
          } else {
            //else add transaction data to return object
            returnData.doctoConsultations = resultConsultationData;
            console.log("resultPatientData :"+resultConsultationData);
            console.log("returnData :"+JSON.parse(JSON.stringify(returnData.doctoConsultations)));

            res.json(JSON.parse(returnData.doctoConsultations));

          }

        })
      });
//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
  port = process.env.PORT;
}

//run app on port
app.listen(port, function() {
  console.log('app running on port: %d', port);
});
