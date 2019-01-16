const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.example.basic';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'emergency-network';
let factory;


/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = 'emergency-network';

  //declare metadata
  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  //get connectionProfile from json, create Idcard
  const connectionProfile = require('./local_connection.json');
  const card = new IdCard(metadata, connectionProfile);

  //import card
  await adminConnection.importCard(cardName, card);
}


/*
* Reconnect using a different identity
* @param {String} cardName The identity to use
*/
async function useIdentity(cardName) {

  //disconnect existing connection
  await businessNetworkConnection.disconnect();

  //connect to network using cardName
  businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect(cardName);
}


//export module
module.exports = {
/*
  * Create Member participant and import card for identity
  * @param {String} cardId Import card id for member
  */
 getManufacturers: async function (cardId) {
  try {

    console.log("Hi-"+cardId);
    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@infiniun-network');

    //get the factory for the business network
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    
    //add member participant
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Manufacturer');
    await participantRegistry.getAll();

    console.log("here1");
    
    //disconnect
    await businessNetworkConnection.disconnect('admin@infiniun-network');

    return true;
  }
  catch(err) {
    //print and return error
    console.log("here111 "+err);
    var error = {};
    error.error = err.message;
    return error;
  }

},




  /*
  * Create Doctor participant and import card for identity
  * @param {String} cardId Import card id for member
  * @param {String} password Member account number as identifier on network
  * @param {String} firstName Member first name
  * @param {String} lastName Member last name
  */
 registerDoctor: async function (cardId,firstName, lastName, doctorId) {
    try {

      console.log("Hi-"+cardId);
      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@emergency-network');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create member participant
      const doctor = factory.newResource(namespace, 'Doctor', cardId);
      doctor.firstName = firstName;
      doctor.lastName = lastName;
      doctor.doctorId=doctorId;

      //add member participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor');
      await participantRegistry.add(doctor);

      console.log("here1");
      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Doctor#' + cardId, cardId);
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

      //import card for identity
      await importCardForIdentity(cardId, identity);
      console.log(cardStore);
      //disconnect
      await businessNetworkConnection.disconnect('admin@emergency-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log("here111 "+err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Create Patient participant and import card for identity
  * @param {String} cardId Import card id for member
  * @param {String} patientid Member account number as identifier on network
  * @param {String} firstName Member first name
  * @param {String} lastName Member last name
  */
 registerPatient: async function (cardId,firstName, lastName, patientid) {
    try {

      console.log("Hi-"+cardId);
      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@emergency-network');

      //get the factory for the business network
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create member participant
      const patient = factory.newResource(namespace, 'Patient', cardId);
      patient.firstName = firstName;
      patient.lastName = lastName;
      patient.patientid=patientid;

      //add member participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
      await participantRegistry.add(patient);

      console.log("here1");
      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Patient#' + cardId, cardId);
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

      //import card for identity
      await importCardForIdentity(cardId, identity);
      console.log(cardStore);
      //disconnect
      await businessNetworkConnection.disconnect('admin@emergency-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log("here111 "+err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },



  /*
  * Create Member participant and import card for identity
  * @param {String} cardId Import card id for member
  * @param {String} emergencyDataid Member account number as identifier on network
  * @param {String} licenceNumber Member first name
  */
 registerEmergencyDoctor: async function (cardId,emergencyDataid, licenceNumber) {
  try {

    console.log("Hi-"+cardId);
    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@emergency-network');

    //get the factory for the business network
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //create member participant
    const emergencyDoctor = factory.newResource(namespace, 'EmergencyDoctor', cardId);
    emergencyDoctor.emergencyDataid = emergencyDataid;
    emergencyDoctor.licenceNumber = licenceNumber;

    //add member participant
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.EmergencyDoctor');
    await participantRegistry.add(emergencyDoctor);

    console.log("here1");
    //issue identity
    const identity = await businessNetworkConnection.issueIdentity(namespace + '.EmergencyDoctor#' + cardId, cardId);
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

    //import card for identity
    await importCardForIdentity(cardId, identity);
    console.log(cardStore);
    //disconnect
    await businessNetworkConnection.disconnect('admin@emergency-network');

    return true;
  }
  catch(err) {
    //print and return error
    console.log("here111 "+err);
    var error = {};
    error.error = err.message;
    return error;
  }

},
  

  



  /*
  * Get Patient data
  * @param {String} cardId Card id to connect to network
  * @param {String} patientId patient to which emergency access will be granted
  */
 getPatientData: async function (patientId,cardId) {

  try {
    console.log("############################################");

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    const allAssets = [];
    const patientLabData = await businessNetworkConnection.query('patientLabTest',{ patient: 'resource:org.example.basic.Patient#'+patientId });
    allAssets.push(patientLabData);


    const patientDrugsData = await businessNetworkConnection.query('patientLabTest',{ patient: 'resource:org.example.basic.Patient#'+patientId });
    allAssets.push(patientDrugsData);


    //disconnect
    await businessNetworkConnection.disconnect(cardId);
    //return member object
    return JSON.stringify(allAssets);
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }

},



/*
  * Get SharedDrugs data
  * @param {String} cardId Card id to connect to network
  * @param {String} pharmacyID Account number of member
  */
 getSharedDrugs: async function (pharmacyID,cardId) {

  try {
    console.log("############################################");

    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardId);
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //startConsultation.doctor = factory.newRelationship(namespace, 'Manufacturer', doctorID);

    const sharedDrugs = await businessNetworkConnection.query('getSharedDrugs',{ pharmacyID: 'resource:org.acme.Pharmacy#'+pharmacyID });
    


    //disconnect
    await businessNetworkConnection.disconnect(cardId);
    //return member object
    return JSON.stringify(sharedDrugs);
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }

},



/*
  * End Consultation data
  * @param {String} cardId Card id to connect to network
  * @param {String} doctorID DOCTOR ID 
  * 
  * @param {String} treatmentID 
  * @param {String} procedure 
  * @param {Boolean} medRequired  
  * @param {Boolean} hospitalVisitNeeded 
  * @param {Boolean} labTestRequired  
  * 
  * @param {String} illnessDescription  
  * @param {String} message 
  * 
  * 
  * @param {String} consultationID 
  * 
  * 
  * @param {String} treatmentDrugsID 
  * @param {String} medicineName
  * @param {String} medicineMG
  * @param {String} medicineAmount
  * 
  * 
  * @param {String} doctorID
  * @param {String} patientID
  */
 endConsultation: async function (cardId, consultationID,medicineName, medRequired,patientID, doctorID,illnessDescription,message,treatmentID,treatmentDrugsID,medicineMG,medicineAmount) {

    try {
        console.log("start Consultation Details : cardID :"+cardId, "consultID :"+consultationID, "medReq :"+medRequired,"PID :"+patientID, "Doc-Id :"+doctorID,"Illness-Desc :"+illnessDescription,"messge :"+message,"treatID :"+treatmentID,"teatDrgId :"+treatmentDrugsID);

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@infiniun-network');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const startConsultation = factory.newTransaction(namespace, 'EndConsultation');
     

      //concultationDetails Entry
      startConsultation.consultationDetails = factory.newConcept(namespace, 'ConsultationDetails');

      startConsultation.consultationDetails.illnessDescription=illnessDescription;
      startConsultation.consultationDetails.message=message;


        //Treatment Entry
        startConsultation.treatment = factory.newResource(namespace, 'Treatment',treatmentID);
        startConsultation.treatment.procedure = "take medicine";
        startConsultation.treatment.hospitalVisitNeeded = false;
        startConsultation.treatment.medRequired = medRequired;
        startConsultation.treatment.labTestRequired = false;
        startConsultation.treatment.consultation = factory.newRelationship(namespace, 'Consultation',consultationID);
      
      
        //TreatmentDrugs Entry
        startConsultation.treatmentDrugs = factory.newResource(namespace, 'TreatmentDrugs',treatmentDrugsID);
        startConsultation.treatmentDrugs.treatment = factory.newRelationship(namespace, 'Treatment',treatmentID);


       startConsultation.treatmentDrugs.medicine=factory.newConcept(namespace, 'Medicine');
       medicine=factory.newConcept(namespace, 'Medicine');
        medicine.name=medicineName;
        medicine.mg=medicineMG;
        medicine.amount=medicineAmount;
      
       startConsultation.treatmentDrugs.medicine=[medicine
       ]

       



        startConsultation.consultation = factory.newRelationship(namespace, 'Consultation', consultationID);
        startConsultation.patient = factory.newRelationship(namespace, 'Patient', patientID);
        startConsultation.doctor = factory.newRelationship(namespace, 'Manufacturer', doctorID);

      // console.log("model="+JSON.stringify(startConsultation));
      // console.log("parameter="+JSON.stringify(consultation));
  
      //submit transaction
      await businessNetworkConnection.submitTransaction(startConsultation);
      //disconnect
      await businessNetworkConnection.disconnect('admin@infiniun-network');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },



  /*
  * Get Patient data
  * @param {String} cardId Card id to connect to network
  * @param {String} partnerId Patient Id of partner
  */
  partnerData: async function (cardId, patientID) {

    try {

      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get member from the network
      const patientRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
      const patient = await patientRegistry.get(patientID);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return partner object
      return patient;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Get all partners data
  * @param {String} cardId Card id to connect to network
  */
  allPartnersInfo : async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query all partners from the network
      const allPartners = await businessNetworkConnection.query('selectPartners');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return allPartners object
      return allPartners;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  /*
  * Get all EarnPoints transactions data
  * @param {String} cardId Card id to connect to network
  */
  earnPointsTransactionsInfo: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query EarnPoints transactions on the network
      const earnPointsResults = await businessNetworkConnection.query('selectEarnPoints');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return earnPointsResults object
      return earnPointsResults;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Get all UsePoints transactions data
  * @param {String} cardId Card id to connect to network
  */
  usePointsTransactionsInfo: async function (cardId) {

    try {
      //connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //query UsePoints transactions on the network
      const usePointsResults = await businessNetworkConnection.query('selectUsePoints');

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      //return usePointsResults object
      return usePointsResults;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  }

}
