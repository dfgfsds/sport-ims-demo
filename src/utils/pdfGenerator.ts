import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFData {
  registrationId: string;
  playerName: string;
  eventName: string;
  eventDate: string;
  venue: string;
  skateCategory: string;
  ageGroup: string;
  selectedRaces: any;
  dob:any;
  chestNumber: string;
  gender: string;
  amountPaid: number;
  registrationDate: string;
  profileImageUrl?: string;
  email: string;
  mobileNumber: string;
  address: string;
  clubName: string;
  aadharNumber: string;
  districtName: string;
  stateName: string;
  
  playerId: string;
  instructions: string;
  declaration: string;
}

export const generateRegistrationPDF = async (data: PDFData): Promise<void> => {
  console.log('Generating PDF with data:', data);
  // Create a temporary div for PDF content
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '800px';
  tempDiv.style.padding = '0';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

  // Helper to format date from yyyy-mm-dd to dd MMM yyyy
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  tempDiv.innerHTML = `
    <div style="width: 100%; margin: 0; padding: 0;">
      <!-- Header with event details -->
      <div style="width: 100%; height: 120px; padding: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; margin-bottom: 15px; border-radius: 10px; border: 3px solid transparent; background: #f3f4f6; position: relative;">
        <div style="position: absolute; inset: 0; pointer-events: none;">
          <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
          </div>
          <div style="position: absolute; left: 0; top: 0; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          </div>
          <div style="position: absolute; right: 0; top: 0; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          </div>
        </div>
        <div style="font-size: 32px; font-weight: bold; margin-bottom: 8px; text-align: center; position: relative; z-index: 1;">
        ${data.eventName} 
        </div>
        <div style="font-size: 18px; font-weight: 500; margin-bottom: 4px; text-align: center; position: relative; z-index: 1;">
          Venue: <span>${data.venue || 'N/A'}</span>
        </div>
        <div style="font-size: 12px; text-align: center; position: relative; z-index: 1;">
          Date: <span>${formatDate(data.eventDate)}</span>
        </div>
      </div>
      
      <div style="padding: 0 40px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; margin-bottom: 5px;">
          <!-- Player Details -->
          <div>
            <div style="font-size: 14px; color: #374151; line-height: 1.6;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.playerName}</p>
              <p style="margin: 5px 0;"><strong>Aadhar Number:</strong> ${data.aadharNumber}</p>
              ${
                data.chestNumber
                  ? `<p style="margin: 5px 0;"><strong>Chest No:</strong> ${data.chestNumber}</p>`
                  : ''
              }
              <p style="margin: 5px 0;"><strong>Club:</strong> ${data.clubName}</p>
            </div>
          </div>

          <!-- Event Details -->
          <div>
            <div style="font-size: 14px; color: #374151; line-height: 1.6;">
              <p style="margin: 5px 0;"><strong>Registration Date:</strong> ${
                formatDate(data.registrationDate)
              }</p>
              <p style="margin: 5px 0;"><strong>Category:</strong> ${data.skateCategory}</p>
              <p style="margin: 5px 0;"><strong>Age Group:</strong> ${data.ageGroup}</p>
              <p style="margin: 5px 0;"><strong>District:</strong> ${data.districtName}</p>
              <p style="margin: 5px 0;"><strong>State:</strong> ${data.stateName}</p>
            </div>
          </div>

          <!-- Photo + Registration ID -->
          <div style="text-align: center;">
            ${data.profileImageUrl ? `
              <img src="${data.profileImageUrl}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px; border: 3px solid #e5e7eb;" crossorigin="anonymous" />
            ` : `
              <div style="width: 100px; height: 100px; background: #e5e7eb; display: flex; align-items: center; justify-content: center; border-radius: 10px; margin: 0 auto;">
                <span style="font-size: 40px; color: #6b7280;">👤</span>
              </div>
            `}
          </div>
        </div>

        <div style="margin-bottom: 5px;">
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; margin-top: 0;">Selected Races</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            ${data.selectedRaces.map((race: any) => {
              const raceName = typeof race === 'string' ? race : race.name;
              return `
                <div style="background: #f3f4f6; padding: 10px; border-radius: 5px; text-align: center;">
                  <span style="font-weight: bold; color: #1f2937;">${raceName}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h4 style="color: #1f2937; margin-bottom: 10px; margin-top: 0;">Instructions</h4>
          <ul style="font-size: 12px; color: #374151; line-height: 1.5; padding-left: 20px; list-style: disc; margin: 0;">
            ${data.instructions ? data.instructions.split('\n').map(line => `<li>${line}</li>`).join('') : '<li>No instructions provided</li>'}
          </ul>
        </div>

        <div style="margin-bottom: 30px; padding: 15px; background: #fef9c3; border: 1px solid #fde68a; border-radius: 10px;">
          <p style="font-size: 12px; color: #92400e; line-height: 1.5; margin: 0;">
            <strong>Declaration:</strong> 
            ${data.declaration ? data.declaration : 'I hereby declare that the above information is true to the best of my knowledge. I agree to abide by the rules and regulations of the event.'}
          </p>
        </div>

        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: center; width: 30%;">
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 5px; border-bottom: 1px solid #d1d5db; padding-bottom: 20px;">Parent Signature</p>
          </div>
          <div style="text-align: center; width: 30%;">
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 5px; border-bottom: 1px solid #d1d5db; padding-bottom: 20px;">Club/Coach Signature</p>
          </div>
          <div style="text-align: center; width: 30%;">
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 5px; border-bottom: 1px solid #d1d5db; padding-bottom: 20px;">Organizer Signature</p>
          </div>
        </div>

        <div style="text-align: center; padding: 15px; background: #f9fafb; border-radius: 5px; border: 2px solid #d1d5db;">
          <p style="font-size: 8px; color: #6b7280; margin: 0;">
            Please bring this certificate and a valid ID to the event venue<br/>
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </p>
          <p style="font-size: 10px; color: #16a34a; margin: 5px 0 0 0;">
            Digitally generated, no signature required.
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    // Wait for images to load
    const images = tempDiv.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        }
      });
    }));

    // Generate canvas from the div
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: tempDiv.scrollHeight,
      width: tempDiv.scrollWidth
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // If content is longer than one page, add multiple pages
    if (imgHeight > 297) { // A4 height in mm
      let yPosition = 0;
      const pageHeight = 297;
      
      while (yPosition < imgHeight) {
        const remainingHeight = imgHeight - yPosition;
        const currentPageHeight = Math.min(pageHeight, remainingHeight);
        
        if (yPosition > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(
          canvas.toDataURL('image/png'), 
          'PNG', 
          0, 
          -yPosition, 
          imgWidth, 
          imgHeight
        );
        
        yPosition += pageHeight;
      }
    } else {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    }
    
// const idCardDiv = document.createElement('div');
// idCardDiv.style.position = 'absolute';
// idCardDiv.style.left = '-9999px';
// idCardDiv.style.width = '800px';
// idCardDiv.style.height = '500px';
// idCardDiv.style.background = 'white';
// idCardDiv.style.fontFamily = 'Arial, sans-serif';

// idCardDiv.innerHTML = `
//   <div style="width: 100%; height: 100%; border: 2px solid #d1d5db; border-radius: 10px; overflow: hidden;">

//     <!-- Top Banner -->
//     <div style="background: linear-gradient(to right, #F97316, #EF4444, #6366F1); color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center;">
//       <div style="font-weight: bold; font-size: 18px;">
// TAMIL NADU SKATERS AND SKATING COACHES ASSOCIATION </div>
//       <div style="background: white; color: red; font-weight: bold; padding: 5px 10px; border-radius: 5px; font-size: 16px;">
//         ${data.registrationId}
//       </div>
//     </div>

//     <!-- Main Body -->
//     <div style="display: flex; padding: 20px; justify-content: space-between; align-items: center;">
      
//       <!-- Profile Photo -->
//       <div style="flex: 0 0 150px;">
//         ${data.profileImageUrl ? `
//           <img src="${data.profileImageUrl}" style="width: 140px; height: 180px; object-fit: cover; border: 2px solid #e5e7eb;" crossorigin="anonymous" />
//         ` : `
//           <div style="width: 140px; height: 180px; background: #e5e7eb; display: flex; align-items: center; justify-content: center;">
//             <span style="font-size: 40px;">👤</span>
//           </div>
//         `}
//       </div>

//       <!-- Details -->
//       <div style="flex: 1; padding-left: 30px; font-size: 14px;">
//         <p><strong>Name</strong> : ${data.playerName}</p>
//         <p><strong>Registered As</strong> : Player</p>
//         <p><strong>D.O.B</strong> : ${data.dob}</p>
//         <p><strong>Gender</strong> :  ${data.gender}</p>
//         <p><strong>Country</strong> : India</p>
//         <p><strong>State</strong> : ${data.stateName}</p>
//         <p><strong>Validity Upto</strong> : 31-12-2025</p>
//         <p><strong>Renewal Date</strong> : 02-07-2025</p>
//       </div>

//       <!-- QR -->
//       <div style="flex: 0 0 120px; text-align: center;">
//         <img src="https://player.tnssca.org/playerlookup/${data.playerId}" style="width: 100px; height: 100px;" />
//       </div>
//     </div>

//     <!-- Footer -->
//     <div style="background: #facc15; padding: 10px; text-align: center; font-size: 14px; font-weight: bold; color: #1e293b;">
//       tnssca.org
//     </div>
//   </div>
// `;

// document.body.appendChild(idCardDiv);

// // Wait for images (photo + QR) to load
// const idImages = idCardDiv.querySelectorAll('img');
// await Promise.all(Array.from(idImages).map(img => {
//   return new Promise((resolve) => {
//     if (img.complete) resolve(true);
//     else {
//       img.onload = () => resolve(true);
//       img.onerror = () => resolve(true);
//     }
//   });
// }));

// // Convert to canvas
// const idCanvas = await html2canvas(idCardDiv, {
//   scale: 2,
//   useCORS: true,
//   backgroundColor: '#ffffff',
// });

// // Add new page and draw
// pdf.addPage();
// const imgWidth2 = 210;
// const imgHeight2 = (idCanvas.height * imgWidth2) / idCanvas.width;
// pdf.addImage(idCanvas.toDataURL('image/png'), 'PNG', 0, 10, imgWidth2, imgHeight2);

// // Clean up
// document.body.removeChild(idCardDiv);


    // Save the PDF
    pdf.save(`Registration_${data.registrationId}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};

export const generateExistingRegistrationPDF = async (registration: any): Promise<void> => {
  try {
    const pdfData: PDFData = {
      registrationId: registration.id,
      playerId: registration.player.id,
      playerName: registration.player.name,
      dob: registration.player.dob ? new Date(registration.player.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '', // Mock date
      gender: registration.player.gender ?? '',
      eventName: registration.event.name,
      chestNumber: registration.chestNumber ?? '', // Mock chest number
      eventDate: registration.event.eventDate, // Mock date
      venue: '', // Mock venue
      skateCategory: registration.skateCategory,
      ageGroup: registration.ageGroup, // Mock age group
      selectedRaces: registration.selectedRaces,
      amountPaid: registration.amountPaid,
      registrationDate: registration.event.createdAt
        ? new Date(registration.event.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '',
      profileImageUrl: registration.profileImageUrl,
      email: registration.player.email ?? '', // Mock email
      mobileNumber: registration.player.mobileNumber ?? '', // Mock mobile
      address: registration.player.address ?? '', // Mock address
      clubName: registration.clubName ?? '',
      districtName: registration.player.districtName ?? '', // Mock district name
      stateName: registration.player.stateName ?? '', // Mock state name
      aadharNumber: registration.player.aadharNumber ?? '' // Mock Aadhar number
      ,
      instructions: '',
      declaration: ''
    };

    await generateRegistrationPDF(pdfData);
  } catch (error) {
    console.error('Error generating existing registration PDF:', error);
  }
};