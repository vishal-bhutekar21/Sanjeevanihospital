# Research Dossier: Clinical Departments & Specialties

**Entity:** Sanjeevani Multispeciality Hospital  
**Scope:** Complete Department Taxonomy with Bilingual English/Marathi Mapping

---

## Department Directory Matrix

| # | Department Name (English) | Department Name (मराठी) | Slug | Key Clinical Services |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Orthopedics & Joint Replacement** | अस्थिरोग आणि सांधे प्रत्यारोपण | `orthopedics` | Fracture management, arthroscopy, joint replacement, spine care |
| 2 | **Pediatrics & Neonatology** | बालरोग आणि नवजात शिशु काळजी | `pediatrics` | Child immunizations, NICU support, pediatric emergency, growth clinic |
| 3 | **Obstetrics & Gynecology** | प्रसूती आणि स्त्रीरोग विभाग | `obstetrics-gynecology` | Normal & Cesarean deliveries, high-risk pregnancy, laparoscopy |
| 4 | **General & Laparoscopic Surgery** | सामान्य आणि दुर्बिणीद्वारे शस्त्रक्रिया | `general-surgery` | Hernia, appendix, gallbladder, abdominal surgeries |
| 5 | **ICU & Critical Care** | अतिदक्षता विभाग आणि क्रिटिकल केअर | `icu-critical-care` | 24x7 Intensivist support, multi-organ failure management, ventilator care |
| 6 | **Internal Medicine** | सामान्य औषधोपचार विभाग | `internal-medicine` | Diabetes, hypertension, infectious diseases, fever clinic |
| 7 | **Cardiology & CVTS** | हृदयविकार विभाग | `cardiology` | ECG, 2D Echo, cardiac emergency stabilization |
| 8 | **Nephrology & Dialysis** | मूत्रपिंड विकार आणि डायलिसिस | `nephrology-dialysis` | Hemodialysis, chronic kidney disease management |
| 9 | **Urology** | मूत्रमार्ग विकार विभाग | `urology` | Kidney stones, prostate disorders, laser surgeries |
| 10 | **Neurology & Neurosurgery** | मेंदू आणि मज्जारज्जू विकार | `neurology-neurosurgery` | Stroke care, head injuries, spinal trauma |
| 11 | **Gastroenterology** | पोट आणि पचनसंस्था विकार | `gastroenterology` | Upper GI endoscopy, liver disease management |
| 12 | **Dermatology** | त्वचा आणि सौंदर्य विकार | `dermatology` | Skin infections, allergy clinics, dermatological care |
| 13 | **Pathology & Diagnostic Lab** | पॅथॉलॉजी आणि तपासणी लॅब | `pathology` | Complete blood counts, biochemistry, microbiology, 24x7 testing |
| 14 | **Radiology & Imaging** | रेडिओलॉजी आणि इमेजिंग | `radiology` | Digital X-Ray, ultrasonography, Doppler studies |
| 15 | **Anesthesiology & Pain Management** | भूलशास्त्र आणि वेदना व्यवस्थापन | `anesthesiology` | Surgical anesthesia, post-op pain management, critical airway |
| 16 | **Physiotherapy & Rehabilitation** | फिजिओथेरपी आणि पुनर्वसन | `physiotherapy` | Post-trauma rehab, stroke rehabilitation, ergonomic care |

---

## Information Architecture for Department Pages
Each dynamic department route (`/departments/:slug`) will render:
1. **Header Banner**: Department Name, Bilingual Title, Quick Booking CTA.
2. **Clinical Scope & Procedures**: Plain-language description of treated conditions.
3. **Faculty / Assigned Doctors**: List of specialists mapped to this department with direct slot booking.
4. **Specialized Diagnostic / Treatment Facilities**: Dedicated equipment in this ward.
5. **Emergency Protocol**: Specific guidance if presenting with acute symptoms.
