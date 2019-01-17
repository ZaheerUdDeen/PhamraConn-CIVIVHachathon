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
  var emergencyDataid=req.body.emergencyDataid;
  var licenceNumber=req.body.licenceNumber;
  var cardId=req.body.emergencyDataid;
  var authorizedDoctors=["A1B2aa444","B1B2aa444","C1B2aa444","D1B2aa444","E1B2aa444","F1B2aa444","G1B2aa444","H1B2aa444","I1B2aa444","J1B2aa444","J1B2aa444"]
      if(authorizedDoctors.indexOf(licenceNumber)>-1)
      {
        console.log("authorized Doctor-"+licenceNumber);
        //else register member on the network
        network.registerEmergencyDoctor(cardId, emergencyDataid, licenceNumber)
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
  var cardId=req.body.patientid;
  var patientid=req.body.patientid;
  
  //print variables
  console.log('Using param - firstname: ' + firstName + ' lastname: ' + lastName + ' cardId: ' + cardId + ' patientid: ' + patientid );

        //else register member on the network
        network.registerPatient(cardId, firstName, lastName, patientid)
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
//post call to register partner on the network
app.post('/api/registerPatient', function(req, res) {

  //declare variables to retrieve from request
  var name = req.body.name;
  var contact = req.body.contact;
  var partnerId = req.body.partnerid;
  var cardId = req.body.cardid;

  //print variables
  console.log('Using param - name: ' + name + ' partnerId: ' + partnerId + ' cardId: ' + cardId);

  
        //else register partner on the network
        network.registerPartner(cardId, partnerId, name, contact)
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

//post call to register partner on the network
app.post('/api/registerPharmacy', function(req, res) {

  //declare variables to retrieve from request
  var name = req.body.name;
  var contact = req.body.contact;
  var pharmacyId = req.body.pharmacyId;
  var cardId = req.body.cardid;
  var pharmacyMedDB=req.body.pharmacyMedDB;
  //print variables
  console.log('Using param - name: ' + name + ' pharmacyId: ' + pharmacyId + ' cardId: ' + cardId);

        //else register partner on the network
        network.registerPharmacy(cardId, pharmacyId, name, contact,pharmacyMedDB)
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
//post call to register partner on the network
app.post('/api/registerLabs', function(req, res) {

  //declare variables to retrieve from request
  var contact = req.body.contact;
 
  var partnerId = req.body.partnerid;
  var cardId = req.body.cardid;

  //print variables
  console.log('Using param - name: ' + contact + ' partnerId: ' + partnerId + ' cardId: ' + cardId);
        //else register partner on the network
        network.registerLabs(cardId, partnerId, contact)
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


//post call to perform EarnPoints transaction on the network
app.post('/api/beginConsultation', function(req, res) {

  //declare variables to retrieve from request
  var patientID = req.body.patientID;
  var cardId = req.body.cardid;
  var doctorID = req.body.doctorID;
  var consultationID = req.body.consultationID;
  var illnessDescription = req.body.illnessDescription;

  var message = req.body.message;
  var consultationCompleted = req.body.consultationCompleted;


  //print variables

  //validate points field

  
        //else perforn EarnPoints transaction on the network
        network.beginConsultation(cardId,consultationID,patientID,doctorID,illnessDescription,message,consultationCompleted)
        .then((response) => {
          console.log(response);
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

//post call to perform EarnPoints transaction on the network
app.post('/api/endConsultation', function(req, res) {

  //declare variables to retrieve from request
  //req.body.patientID;
  var patientID = req.body.patientID;
  var cardId = req.body.cardId;
  var doctorID = req.body.doctorID;
  var consultationID = req.body.consultationID;
  var message = req.body.message;
  var medRequired=true;
  var treatmentDrugsID=req.body.treatmentDrugsID;
  var treatmentID=req.body.treatmentID;
  var illnessDescription=req.body.illnessDescription;
  var medicineName=req.body.medicineName;
  var medicineMG=req.body.medicineMG;
  var medicineAmount=req.body.medicineMG;
//,treatmentID,treatmentDrugsID

  //print variables
  //console.log('Using param - cardId: ' + cardId + ' partnerId: ' + patientID + ' accountNumber: ' + doctorID );

  //validate points field

  
        //else perforn EarnPoints transaction on the network
        network.endConsultation(cardId, consultationID,medicineName, medRequired,patientID, doctorID,illnessDescription,message,treatmentID,treatmentDrugsID,medicineMG,medicineAmount)
        .then((response) => {
          console.log(response);
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



//post call to perform UsePoints transaction on the network
app.post('/api/usePoints', function(req, res) {

  //declare variables to retrieve from request
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var partnerId = req.body.partnerid;
  var points = parseFloat(req.body.points);

  //print variables
  console.log('Using param - points: ' + points + ' partnerId: ' + partnerId + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //validate points field
  validate.validatePoints(points)
    //return error if error in response
    .then((checkPoints) => {
      if (checkPoints.error != null) {
        res.json({
          error: checkPoints.error
        });
        return;
      } else {
        points = checkPoints;
        //else perforn UsePoints transaction on the network
        network.usePointsTransaction(cardId, accountNumber, partnerId, points)
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
      }
    });


});

//post call to retrieve member data, transactions data and partners to perform transactions with from the network
app.post('/api/doctorData', function(req, res) {

  //declare variables to retrieve from request
  var doctorID = req.body.doctorID;
  var cardId = req.body.cardid;

  //print variables
  console.log('memberData using param - ' + ' doctorID: ' + doctorID + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get member data from network
  network.memberData(cardId, doctorID)
    .then((doctor) => {
      //return error if error in response
      if (doctor.error != null) {
        res.json({
          error: doctor.error
        });
      } else {
        //else add doctor data to return object
        returnData.doctorID = doctor.doctorID;
        returnData.name = doctor.doctorName;
        returnData.contact = doctor.contact;
        returnData.description = doctor.description;
      }

      console.log(returnData);

      res.json(returnData);

    })
    
  });
    




//post call to retrieve patient Consultation
app.post('/api/patientConsultation', function(req, res) {

//req.body.patientID
  var patientID = req.body.patientID;
  var cardId = req.body.cardid;
  console.log('memberData using param - ' + ' patientID: ' + patientID + ' cardId: ' + cardId);
  var returnData=[];
      //get UsePoints transactions from the network
      network.getPatientConsultationData(patientID,cardId)
        .then((resultConsultationData) => {
          //return error if error in response
          if (resultConsultationData.error != null) {
            res.json({
              error: resultConsultationData.error
            });
          } else {
            //else add transaction data to return object
            returnData =[resultConsultationData];
            // console.log("resultConsultationData :"+resultConsultationData);
             console.log("returnData :"+returnData);

            res.json(returnData);

          }

        })
      });

//post call to retrieve patient Consultation
app.post('/api/getSharedDrugs', function(req, res) {


  var pharmacy = req.body.pharmacy;
  var cardId = req.body.cardid;
  console.log('memberData using param - ' + ' pharmacy: ' + doctorID + ' cardId: ' + cardId);
  var returnData = {};
      //get UsePoints transactions from the network
      network.getSharedDrugs(pharmacy,cardId)
        .then((resultDrugsData) => {
          //return error if error in response
          if (resultDrugsData.error != null) {
            res.json({
              error: resultDrugsData.error
            });
          } else {
            //else add transaction data to return object
            returnData.resultDrugsData = resultDrugsData;
            console.log("resultDrugsData :"+resultDrugsData);
            console.log("returnData :"+JSON.parse(JSON.stringify(returnData.resultDrugsData)));

            res.json(JSON.parse(returnData.resultDrugsData));

          }

        })
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
      
//post call to retrieve partner data and transactions data from the network
app.post('/api/patientData', function(req, res) {

  //declare variables to retrieve from request
  var partnerId = req.body.patientid;
  var cardId = req.body.cardid;

  //print variables
  console.log('partnerData using param - ' + ' partnerId: ' + partnerId + ' cardId: ' + cardId);

  //declare return object
  var returnData = {};

  //get partner data from network
  network.partnerData(cardId, partnerId)
    .then((patient) => {
      //return error if error in response
      if (patient.error != null) {
        res.json({
          error: patient.error
        });
      } else {
        //else add partner data to return object
        returnData.id = patient.patientID;
        returnData.name = patient.name;
        returnData.contact = patient.contact;
      }

      console.log(returnData);

      res.json(returnData);

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
