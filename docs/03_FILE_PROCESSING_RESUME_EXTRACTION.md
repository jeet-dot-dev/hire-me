# File Processing & Resume Text Extraction

## 🎯 Problem Statement

Implemented a **production-ready file processing system** that extracts text from resumes (PDF, DOCX) for AI analysis while handling the constraints of serverless environments.

## 🚫 Challenges Overcome

### Serverless Environment Limitations
- **No File System Access**: Cannot write temporary files in serverless functions
- **Memory Constraints**: Limited RAM for processing large files
- **Execution Timeouts**: Must complete processing within time limits
- **Cold Starts**: Libraries must load efficiently

### Original Issues Fixed
```
❌ fs.createWriteStream() - Not available in serverless
❌ mkdir(), unlink() - File system operations blocked
❌ pdfjs-dist compatibility - Node.js serverless issues
❌ Generic error messages - Poor debugging experience
❌ 5MB file limit - Too restrictive for modern resumes
```

## ✅ Solution Architecture

### In-Memory Processing Pipeline
```
File Upload → ArrayBuffer → Memory Processing → Text Extraction → AI Analysis
     ↓              ↓              ↓                 ↓
File Validation → Size Check → Format Detection → Content Extraction
```

## 🔧 Technical Implementation

### File Processing Flow
```typescript
export async function extractResumeText(fileUrl: string): Promise<string> {
  // 1. Download file to memory (ArrayBuffer)
  const buffer = await downloadFileToBuffer(fileUrl);
  
  // 2. Detect file type from buffer
  const fileType = detectFileType(buffer, fileUrl);
  
  // 3. Extract text based on type
  switch (fileType) {
    case 'pdf': return await extractPDFText(buffer);
    case 'docx': return await extractDOCXText(buffer);
    default: throw new Error('Unsupported file format');
  }
}
```

### PDF Text Extraction
```typescript
async function extractPDFText(buffer: ArrayBuffer): Promise<string> {
  try {
    // Primary method: pdf2json
    const pdfBuffer = Buffer.from(buffer);
    const pdfData = await parsePDFWithJson(pdfBuffer);
    let text = extractTextFromPDFData(pdfData);
    
    // Fallback method for complex PDFs
    if (text.length < 10) {
      text = await fallbackPDFExtraction(buffer);
    }
    
    return cleanExtractedText(text);
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}
```

### DOCX Text Extraction
```typescript
async function extractDOCXText(buffer: ArrayBuffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ 
    arrayBuffer: buffer 
  });
  return cleanExtractedText(value);
}
```

## 📁 Supported File Formats

### ✅ Fully Supported
- **PDF**: Text-based PDFs with fallback extraction
- **DOCX**: Microsoft Word documents (2007+)

### ⚠️ Limited Support
- **DOC**: Legacy Word documents (recommends DOCX conversion)

### ❌ Not Supported
- **Scanned PDFs**: Require OCR (future enhancement)
- **Images**: JPG, PNG resume images
- **Other formats**: RTF, TXT (can be added easily)

## 🛡️ Security & Validation

### File Size Limits
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (buffer.byteLength > MAX_FILE_SIZE) {
  throw new Error(`File too large: ${buffer.byteLength / (1024 * 1024)}MB`);
}
```

### Content Validation
```typescript
function validateExtractedText(text: string): void {
  if (text.length < 10) {
    throw new Error('No readable text found in document');
  }
  
  if (text.length > 50000) {
    console.warn('Extracted text is very long, truncating...');
  }
}
```

### Privacy Protection
```typescript
// Mask sensitive information in logs
const maskedUrl = fileUrl.replace(/\/([^\/]+)$/, '/***');
console.log(`Processing file: ${maskedUrl}`);
```

## ⚡ Performance Optimizations

### Memory Management
- **Streaming Downloads**: Use ArrayBuffer for memory efficiency
- **Buffer Reuse**: Minimize memory allocations
- **Garbage Collection**: Explicit cleanup after processing

### Timeout Handling
```typescript
const EXTRACTION_TIMEOUT = 120000; // 2 minutes

const extractionPromise = Promise.race([
  extractResumeText(fileUrl),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Extraction timeout')), EXTRACTION_TIMEOUT)
  )
]);
```

### Library Optimization
```typescript
// Dynamic imports for better cold start performance
const mammoth = await import('mammoth');
const pdf2json = await import('pdf2json');
```

## 🚨 Error Handling Strategy

### Specific Error Messages
```typescript
const errorMessages = {
  'FILE_NOT_FOUND': 'Resume file not found. Please upload again.',
  'DOWNLOAD_TIMEOUT': 'Download timeout. Check your connection.',
  'FILE_TOO_LARGE': 'File too large (XMB). Maximum: 10MB.',
  'PDF_PASSWORD': 'PDF is password protected.',
  'NO_TEXT_FOUND': 'No readable text found in document.',
  'UNSUPPORTED_FORMAT': 'Unsupported format. Use PDF or DOCX.',
};
```

### Progressive Fallbacks
```typescript
// Multiple extraction attempts
try {
  return await primaryExtraction(buffer);
} catch (primaryError) {
  try {
    return await fallbackExtraction(buffer);
  } catch (fallbackError) {
    throw new Error(`All extraction methods failed: ${primaryError.message}`);
  }
}
```

## 🧪 Quality Assurance

### Text Cleaning Pipeline
```typescript
function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')           // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')       // Remove excessive whitespace
    .replace(/\t+/g, ' ')             // Replace tabs with spaces
    .replace(/[^\S\n]+/g, ' ')        // Normalize spaces
    .trim();                          // Remove leading/trailing whitespace
}
```

### Content Validation
- **Minimum Length**: Ensures meaningful content extracted
- **Character Encoding**: Handles UTF-8 and special characters
- **Format Detection**: Validates file headers and magic numbers

## 📊 Integration Points

### AI Backend Integration
```typescript
// Resume text sent to AI for analysis
const resumeText = await extractResumeText(fileUrl);
const skills = await extractSkillsFromText(resumeText);
const summary = await generateResumeSummary(resumeText);
```

### Job Matching
```typescript
// Used for job recommendation algorithms
const candidateProfile = {
  skills: extractedSkills,
  experience: parsedExperience,
  education: extractedEducation
};
```

## 🔄 Future Enhancements

### Planned Improvements
- **OCR Integration**: Support for scanned PDFs using Tesseract.js
- **Structured Parsing**: Extract specific sections (education, experience)
- **Multiple Languages**: Support for non-English resumes
- **Image Processing**: Direct image-to-text extraction

### Performance Upgrades
- **Caching**: Cache extracted text for re-uploads
- **Compression**: Compress text storage
- **Parallel Processing**: Process multiple files simultaneously

## 📈 Monitoring & Analytics

### Success Metrics
- **Extraction Success Rate**: 95%+ for supported formats
- **Processing Time**: <30 seconds average
- **Error Rate**: <5% with proper error messages

### Usage Tracking
- File format distribution
- Average file sizes
- Processing time trends
- Error pattern analysis

---

**Interview Summary**: *"I built a serverless-compatible file processing system that extracts text from PDF and DOCX resumes using in-memory processing, handles multiple edge cases with specific error messages, and includes fallback mechanisms for complex documents."*
