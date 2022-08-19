const index_1 = ["GCK", "KCNJ11", "LGR5", "EIF2AK3", "PLAGL1", "DGKB", "CDKAL1", "CDKN2A", "TSPAN8", "CAMK1D", "GCKR", "TLE4", "SLC30A8", "HNF4A", "ZFAND6", "KCNQ1", "HNF1A", "HYMA1", "ADCY5", "TMEM195", "KLF14", "THADA", "PRC1", "JAZF1", "BCL11A", "HHEX", "OASL", "ZBED3", "TCF7L2", "ADAMTS9", "DUSP9", "ABCC8", "WFS1", "FOXP3", "NOTCH2", "RBMS1", "GATA6", "PROX1", "CENTD2", "PPARG", "IGF2BP2", "ITGB6", "MTNR1B", "CDC123", "HMGA2", "HNF1B", "FTO", "TP53INP1", "IRS1", "CDKN2B", "INS"]
const index_2 = ["ARMS2", "CFH"];
const index_3 = ["HLA-DQB1", "HLA-DQA1"];
const index_4 = ["APOL1"];
const index_5 = ["LDLR", "APOB"];
const index_6 = ["TTR"];
const index_7 = ["HFE"];
const index_8 = ["F2", "F5"];
const index_9 = ["APOE"];
const index_10 = ["LRRK2", "GBA"];
const index_11 = ["BRCA1", "BRCA2"];
const index_12 = ["MUTYH"];
const index_13 = ["G6PD"];
const index_14 = ["SERPINA1"];

function gens(gene) {
  if (index_1.indexOf(gene) > -1) {
    return { $in : [/.*Type 2 Diabetes.*/i,/.*Diabetes.*/i,/.*insulin.*/i, /.*Endocrinologist*./i]};
  } else if (index_2.indexOf(gene) > -1) {
    return { $in : [/.*macular degeneration.*/i,/.*AMD.*/i,/.*Photodynamic laser therapy.*/i,/.*Photodynamic therapy.*/i,/.*eye Laser therapy.*/i,/.*vision loss.*/i,/.*Dilated eye exam.*/i,/.*eye.*/i, /.*retinologist*./i]};
  } else if (index_3.indexOf(gene) > -1) {
    return { $in : [/.*Celiac Disease.*/i,/.*Celiac.*/i,/.*small intestine.*/i,/.*gluten-free diet.*/i,/.*chronic digestive and immune disorder.*/i,/.*digestive problem.*/i,/.*intestine.*/i, /.*gastroenterologist*./i, /.*endocrinologist*./i, /.*Gastroenterology*./i]};
  } else if (index_4.indexOf(gene) > -1) {
    return { $in : [/.*chronic kidney failure.*/i,/.*chronic kidney.*/i,/.*dialysis.*/i,/.*kidney transplant.*/i,/.*Glomerular Filtration Rate.*/i,/.*GFR.*/i,/.*Kidney.*/i, /.*Nephrologist*./i]};
  } else if (index_5.indexOf(gene) > -1) {
    return { $in : [/.*Familial Hypercholesterolemia.*/i,/.*Hypercholesterolemia.*/i,/.*coronary heart disease.*/i,/.*heart disease.*/i,/.*heart.*/i,/.*LDL.*/i,/.*cholesterol.*/i,/.*coronary.*/i, /.*endocrinologist*./i, /.*lipidologist*./i]};
  } else if (index_6.indexOf(gene) > -1) {
    return { $in : [/.*Hereditary Amyloidosis.*/i,/.*Amyloidosis.*/i,/.*transplants.*/i,/.*liver transplantation.*/i,/.*hereditary amyloidosis.*/i,/.*ATTR.*/i,/.*Amyloid.*/i, /.*hematologist *./i, /.*hemotology*./i]};
  } else if (index_7.indexOf(gene) > -1) {
    return { $in : [/.*Hereditary Hemochromatosis.*/i,/.*Hemochromatosis.*/i,/.*phlebotomy.*/i,/.*iron.*/i,/.*iron overload.*/i,/.*blood.*/i, /.*Hematologist*./i, /.*Cardiologist*./i]};
  } else if (index_8.indexOf(gene) > -1) {
    return { $in : [/.*Hereditary Thrombophilia.*/i,/.*Thrombophilia.*/i,/.*thrombosis.*/i,/.*blood clot.*/i,/.*blood vessel.*/i,/.*anticoagulant therapy.*/i,/.*anticoagulant.*/i, /.*hematologist *./i, /.*Cardiologist*./i]};
  } else if (index_9.indexOf(gene) > -1) {
    return { $in : [/.*Alzheimer.*/i,/.*memory loss.*/i,/.*Alzheimer’s.*/i, /.*Neurologist*./i, /.*Neuropsychologist*./i, /.*Neurology*./i]};
  } else if (index_10.indexOf(gene) > -1) {
    return { $in : [/.*Parkinson's Disease.*/i,/.*nervous system disorder.*/i,/.*tremor.*/i,/.*Parkinson.*/i, /.*Neurologist*./i, /.*Neuropsychologist*./i, /.*Neurology*./i]};
  } else if (index_11.indexOf(gene) > -1) {
    return { $in : [/.*Hereditary breast cancer.*/i,/.*BREAST CANCER.*/i,/.*mastectomy.*/i,/.*Hereditary ovarian cancer.*/i,/.*BRCA1.*/i,/.*BRCA2.*/i,/.*salpingo-oophorectomy.*/i,/.*OVARIAN CANCER.*/i, /.*Breast surgeon*./i, /.*BREAST SURGERY*./i, /.*Breast*./i, /.*Breast neoplasm*./i, /.*Ovarian*./i, /.*gynecologist oncologist*./i, /.*gynecologist*./i]};
  } else if (index_12.indexOf(gene) > -1) {
    return { $in : [/.*MUTYH-Associated Polyposis.*/i,/.*MAP.*/,/.*Polyposis.*/i,/.*MUTYH.*/i,/.*familial colorectal cancer.*/i,/.*Colonoscopy.*/i,/.*polypectomy.*/i,/.*colectomy.*/i,/.*proctocolectomy.*/i,/.*ileorectal anastomosis (IRA).*/i,/.*ileal pouch-anal anastomosis or J-pouch.*/i,/.*IRA.*/,/.*IPAA.*/i, /.*gastroenterologist *./i, /.*colorectal surgeon*./i, /.*Rectal Surgeon*./i]};
  } else if (index_13.indexOf(gene) > -1) {
    return { $in : [/.*G6PD Deficiency.*/i,/.*G6PD.*/i,/.*Glucose-6-phosphate dehydrogenase.*/i,/.*hemolytic anemia.*/i,/.*anemia.*/i,/.*neonatal hyperbilirubinemia.*/i,/.*hyperbilirubinemia.*/i,/.*hemolysis.*/i,/.*blood transfusion.*/i,/.*hemodialysis.*/i,/.*kidney injury.*/i,/.*oxygen therapy.*/i,/.*Hematologist.*/i,]};
  } else if (index_14.indexOf(gene) > -1) {
    return { $in : [/.*Alpha-1 Antitrypsin Deficiency.*/i,/.*Antitrypsin Deficiency.*/i,/.*Antitrypsin.*/i,/.*chronic obstructive pulmonary obstructive disease.*/i,/.*COPD.*/i,/.*chronic bronchitis.*/i,/.*Asthma.*/i,/.*augmentation therapy.*/i,/.*eplacement therapy.*/i,/.*Pulmonologist.*/,/.*Emphysema.*/i,/.*Hepatologist.*/i,/.*chronic liver disease.*/i,/.* Liver .*/i,/.* Liver,.*/i,/.*,Liver .*/i,]};
  } else {
    return "error";
  }
}
module.exports = gens;
