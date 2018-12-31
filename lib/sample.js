/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * Handle a transaction that returns an array of assets.
 * @param {org.example.basic.patientLabTest} transaction The transaction.
 * @returns {org.example.basic.LabTest[]} All the assets.
 * @transaction
 */
async function patientLabTest(pid) {  
    /*return query('patientLabTest',{patient:'resource:org.acme.Patient#'+pid}).then(function(results){
        

        return results;
    })*/
  const allAssets = [];
    const assetRegistry = await getAssetRegistry('org.example.basic.LabTest');
    const localAssets = await assetRegistry.getAll();
    for (const asset of localAssets) {
        allAssets.push(asset);
    }
   return allAssets;
}

/**
 * Handle a transaction that returns an array of assets.
 * @param {org.example.basic.patientTreatmentDrugs} transaction The transaction.
 * @returns {org.example.basic.TreatmentDrugs[]} All the assets.
 * @transaction
 */
async function patientTreatmentDrugs(pid) {  
    /*return query('patientTreatmentDrugs',{patient:'resource:org.acme.Patient#'+pid}).then(function(results){
        

        return results;
    })*/
  const allAssets = [];
    const assetRegistry = await getAssetRegistry('org.example.basic.TreatmentDrugs');
    const localAssets = await assetRegistry.getAll();
    for (const asset of localAssets) {
        allAssets.push(asset);
    }
   return allAssets;
   
}

