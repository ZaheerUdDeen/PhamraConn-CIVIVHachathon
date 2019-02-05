var moment = require('moment');

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
 registerPatient: async function (cardId,firstName, lastName, patientid,emergencyAccesTimeConstraints) {
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
      patient.emergencyAccesTimeConstraints=emergencyAccesTimeConstraints
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
 registerEmergencyDoctor: async function (cardId,emergencyDoctorid, licenceNumber) {
  try {

    
    console.log("Hi-"+cardId);
    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@emergency-network');

    //get the factory for the business network
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //create member participant
    const emergencyDoctor = factory.newResource(namespace, 'EmergencyDoctor', cardId);
    emergencyDoctor.emergencyDoctorid = emergencyDoctorid;
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

    const allAssets = [];
    //connect to network with cardId
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@emergency-network');
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    //const assetRegistryET = await businessNetworkConnection.getAssetRegistry(namespace + '.EmergencyAccesTimeConstraints');
    //const accesed = await assetRegistryET.get(patientId+cardId);
    const etq = await businessNetworkConnection.query('hasAccesed',{ et: patientId+cardId });
    console.log("accessd :"+etq);


    if(etq.length>0 ){
      console.log("Yess");
      const assetRegistryET = await businessNetworkConnection.getAssetRegistry(namespace + '.EmergencyAccesTimeConstraints');
      const etc = await assetRegistryET.get(patientId+cardId);
      await businessNetworkConnection.disconnect('admin@emergency-network');

      endTime=moment(etc.emergencyAccesEndTime,'MMMM Do YYYY, h:mm:ss a')
      console.log("now :"+moment(moment(),'MMMM Do YYYY, h:mm:ss a'), "endTime :"+endTime);      
      
      if(moment(moment(),'MMMM Do YYYY, h:mm:ss a').isAfter(endTime)){
        
        return JSON.stringify('Acces Denied');

      }


    }else{
        //get patient from the network
        const patientRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
        const patient = await patientRegistry.get(patientId);
        allAssets.push('allAssets',patient);
        var st=""+moment().format('MMMM Do YYYY, h:mm:ss a')
        console.log(st);

        const tc= factory.newResource(namespace, 'EmergencyAccesTimeConstraints',patientId+cardId);
        tc.emergencyAccesStartTime=st

        var et=moment().add(patient.emergencyAccesTimeConstraints, 'hours');
        tc.emergencyAccesEndTime=""+et.format('MMMM Do YYYY, h:mm:ss a')
        tc.emergencyDoctor=factory.newRelationship(namespace, 'EmergencyDoctor', cardId)
        tc.patient=factory.newRelationship(namespace, 'Patient', patientId)
        //add as Aset 
        const assetRegistry = await businessNetworkConnection.getAssetRegistry(namespace + '.EmergencyAccesTimeConstraints');
        await assetRegistry.add(tc);


        await businessNetworkConnection.disconnect('admin@emergency-network');
    }
    
    
    
    

    await businessNetworkConnection.connect(cardId);
    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
   


    const patientLabData = await businessNetworkConnection.query('patientLabTest',{ patient: 'resource:org.example.basic.Patient#'+patientId });
    allAssets.push('LabTests',patientLabData);

    const patientDrugsData = await businessNetworkConnection.query('patientTreatmentDrugs',{ patient: 'resource:org.example.basic.Patient#'+patientId });
    allAssets.push('treatmentDrugs',patientDrugsData);


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

}
