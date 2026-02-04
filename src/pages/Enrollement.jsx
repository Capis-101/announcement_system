import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const HighSchoolEnrollmentForm = () => {
  const initialFormData = {
    lrn: '',
    lastName: '',
    firstName: '',
    middleName: '',
    suffix: '',
    dateOfBirth: '',
    placeOfBirth: '',
    age: '',
    sex: '',
    nationality: '',
    religion: '',
    civilStatus: 'Single',
    houseNoStreet: '',
    barangay: '',
    cityMunicipality: '',
    province: '',
    zipCode: '',
    gradeLevel: '',
    schoolYear: '',
    section: '',
    previousSchool: '',
    schoolAddress: '',
    studentType: '',
    lastGradeCompleted: '',
    track: '',
    strand: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    relationship: '',
    contactNumber: '',
    email: '',
    occupation: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyContact: '',
    agreeToTerms: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'enrollments'), formData);
      setSuccessMessage(`Enrollment submitted successfully! Document ID: ${docRef.id}`);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Firestore error:', error);
      setErrorMessage(`Failed to submit enrollment: ${error.message}`);
    }

    setLoading(false);
  };

  const isSeniorHigh = formData.gradeLevel === '11' || formData.gradeLevel === '12';

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>High School Student Enrollment Form</h2>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}
      {successMessage && <div style={styles.success}>{successMessage}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Student Info */}
        <Section title="🧑‍🎓 STUDENT INFORMATION">
          <InputField label="LRN" name="lrn" value={formData.lrn} onChange={handleChange} required />
          <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
          <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <InputField label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
          <InputField label="Suffix" name="suffix" value={formData.suffix} onChange={handleChange} />
          <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
          <InputField label="Place of Birth" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} required />
          <InputField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
          <SelectField label="Sex" name="sex" value={formData.sex} onChange={handleChange} required options={['Male','Female','Other']} />
          <InputField label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} required />
          <InputField label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
          <SelectField label="Civil Status" name="civilStatus" value={formData.civilStatus} onChange={handleChange} required options={['Single','Married','Other']} />
        </Section>

        {/* Address Info */}
        <Section title="🏠 ADDRESS INFORMATION">
          <InputField label="House / Street" name="houseNoStreet" value={formData.houseNoStreet} onChange={handleChange} required />
          <InputField label="Barangay" name="barangay" value={formData.barangay} onChange={handleChange} required />
          <InputField label="City / Municipality" name="cityMunicipality" value={formData.cityMunicipality} onChange={handleChange} required />
          <InputField label="Province" name="province" value={formData.province} onChange={handleChange} required />
          <InputField label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
        </Section>

        {/* Academic Info */}
        <Section title="📚 ACADEMIC INFORMATION">
          <SelectField label="Grade Level" name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} required options={['7','8','9','10','11','12']} />
          <InputField label="School Year" name="schoolYear" value={formData.schoolYear} onChange={handleChange} required />
          <InputField label="Section" name="section" value={formData.section} onChange={handleChange} />
          <InputField label="Previous School" name="previousSchool" value={formData.previousSchool} onChange={handleChange} required />
          <InputField label="School Address" name="schoolAddress" value={formData.schoolAddress} onChange={handleChange} required />
          <RadioGroup label="Student Type" name="studentType" value={formData.studentType} onChange={handleChange} options={['New Student','Transferee','Balik-Aral']} />
          <InputField label="Last Grade Completed" name="lastGradeCompleted" value={formData.lastGradeCompleted} onChange={handleChange} required />
        </Section>

        {/* Senior High */}
        {isSeniorHigh && (
          <Section title="🎓 SENIOR HIGH ONLY">
            <SelectField label="Track" name="track" value={formData.track} onChange={handleChange} required options={['Academic','TVL','Sports','Arts & Design']} />
            <SelectField label="Strand" name="strand" value={formData.strand} onChange={handleChange} required options={['STEM','ABM','HUMSS','GAS','TVL Specialization']} />
          </Section>
        )}

        {/* Parent / Guardian */}
        <Section title="👨‍👩‍👧 PARENT / GUARDIAN">
          <InputField label="Father’s Name" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
          <InputField label="Mother’s Name" name="motherName" value={formData.motherName} onChange={handleChange} required />
          <InputField label="Guardian’s Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
          <InputField label="Relationship" name="relationship" value={formData.relationship} onChange={handleChange} required />
          <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
          <InputField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
        </Section>

        {/* Emergency Contact */}
        <Section title="📞 EMERGENCY CONTACT">
          <InputField label="Name" name="emergencyName" value={formData.emergencyName} onChange={handleChange} required />
          <InputField label="Relationship" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} required />
          <InputField label="Contact Number" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required />
        </Section>

        <div style={styles.field}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required style={styles.checkbox} />
            I agree to the terms and conditions
          </label>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Submitting...' : 'Enroll Now'}
        </button>
      </form>
    </div>
  );
};

// --- Reusable Components ---
const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    {children}
  </div>
);

const InputField = ({ label, name, value, onChange, type='text', required=false }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} style={styles.input} />
  </div>
);

const SelectField = ({ label, name, value, onChange, options=[], required=false }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <select name={name} value={value} onChange={onChange} required={required} style={styles.select}>
      <option value="">Select</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const RadioGroup = ({ label, name, value, onChange, options=[] }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <div style={styles.radioGroup}>
      {options.map(opt => (
        <label key={opt}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} required={true} />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

// --- Styles ---
const styles = {
  container: { maxWidth: '700px', margin: '50px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column' },
  section: { marginBottom: '30px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' },
  sectionTitle: { marginBottom: '15px', color: '#007bff', fontSize: '18px', fontWeight: 'bold' },
  field: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box' },
  radioGroup: { display: 'flex', gap: '20px', marginTop: '5px', color: '#555' },
  checkboxLabel: { fontWeight: 'bold', color: '#555' },
  checkbox: { marginRight: '10px' },
  button: { padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' },
  error: { padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px', borderRadius: '5px' },
  success: { padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '5px' },
};

export default HighSchoolEnrollmentForm;
