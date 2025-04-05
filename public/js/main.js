// Helper function to round numbers to two decimal places
function roundToTwo(num) {
    return Math.round(num * 100) / 100;
}

// Helper function to calculate required classes
function calculateRequiredClasses(total, present, required) {
    if (required <= (present / total) * 100) {
        return 0;
    }
    return Math.ceil((required * total - 100 * present) / (100 - required));
}

// Function to display error message with animation
function showError(message) {
    const errorOutput = document.getElementById('errorOutput');
    errorOutput.textContent = message;
    errorOutput.style.display = 'block';
    errorOutput.classList.add('active');
    
    // Scroll to error message
    errorOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Function to clear error message
function clearError() {
    const errorOutput = document.getElementById('errorOutput');
    errorOutput.textContent = '';
    errorOutput.style.display = 'none';
    errorOutput.classList.remove('active');
}

// Function to show loading state
function setLoading(isLoading) {
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const calculateBtn = document.getElementById('calculateBtn');
    
    if (isLoading) {
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-block';
        calculateBtn.disabled = true;
    } else {
        btnText.style.display = 'inline-block';
        btnSpinner.style.display = 'none';
        calculateBtn.disabled = false;
    }
}

// Function to display schedule
function displaySchedule(schedule) {
    const weeklyScheduleOutput = document.getElementById('weeklyScheduleOutput');
    
    if (!schedule || schedule.length === 0) {
        weeklyScheduleOutput.innerHTML = '';
        return;
    }
    
    let scheduleHtml = '<h4 style="margin-top: 15px; color: #444; font-size: 1.1rem;">Required Schedule:</h4><ul>';
    
    schedule.forEach(item => {
        scheduleHtml += `<li><strong>${item.day}</strong>: Attend ${item.classes} class(es)</li>`;
    });
    
    scheduleHtml += '</ul>';
    weeklyScheduleOutput.innerHTML = scheduleHtml;
}

// Function to perform the attendance calculation
function calculateAttendance() {
    // Clear previous outputs and errors
    clearError();
    const resultsOutput = document.getElementById('resultsOutput');
    const currentPercentageOutput = document.getElementById('currentPercentageOutput');
    const requiredClassesOutput = document.getElementById('requiredClassesOutput');
    const weeklyScheduleOutput = document.getElementById('weeklyScheduleOutput');
    
    currentPercentageOutput.textContent = '';
    requiredClassesOutput.textContent = '';
    weeklyScheduleOutput.innerHTML = '';
    resultsOutput.style.display = 'none';

    try {
        // Get input values from the HTML
        const totalClasses = document.getElementById('totalClasses').value;
        const presentClasses = document.getElementById('presentClasses').value;
        const requiredPercentage = document.getElementById('requiredPercentage').value;
        const lastDayIndex = document.getElementById('lastDayIndex').value;
        
        // Get regular classes values
        const classesMonday = document.getElementById('classesMonday').value;
        const classesTuesday = document.getElementById('classesTuesday').value;
        const classesWednesday = document.getElementById('classesWednesday').value;
        const classesThursday = document.getElementById('classesThursday').value;
        const classesFriday = document.getElementById('classesFriday').value;
        const classesSaturday = document.getElementById('classesSaturday').value;
        
        // Validate all required fields
        if (!totalClasses || !presentClasses || !requiredPercentage || !lastDayIndex ||
            !classesMonday || !classesTuesday || !classesWednesday || 
            !classesThursday || !classesFriday || !classesSaturday) {
            showError("Please fill in all required fields");
            return;
        }
        
        // Validate numbers
        if (isNaN(totalClasses) || isNaN(presentClasses) || isNaN(requiredPercentage) || 
            isNaN(lastDayIndex) || isNaN(classesMonday) || isNaN(classesTuesday) || 
            isNaN(classesWednesday) || isNaN(classesThursday) || isNaN(classesFriday) || 
            isNaN(classesSaturday)) {
            showError("Please enter valid numbers");
            return;
        }
        
        // Convert to numbers
        const total = parseFloat(totalClasses);
        const present = parseFloat(presentClasses);
        const required = parseFloat(requiredPercentage);
        const lastDay = parseInt(lastDayIndex);
        
        // Additional validation
        if (total <= 0) {
            showError("Total classes must be greater than 0");
            return;
        }
        
        if (present < 0) {
            showError("Present classes cannot be negative");
            return;
        }
        
        if (present > total) {
            showError("Present classes cannot exceed total classes");
            return;
        }
        
        if (required < 0 || required > 100) {
            showError("Required percentage must be between 0 and 100");
            return;
        }
        
        if (lastDay < 0 || lastDay > 5) {
            showError("Last updated day must be between 0 (Monday) and 5 (Saturday)");
            return;
        }
        
        // Calculate current percentage
        const currentPercentage = roundToTwo((present / total) * 100);
        
        // Calculate required classes
        const requiredClasses = calculateRequiredClasses(total, present, required);
        
        // Show loading UI
        setLoading(true);
        
        // Build classes per week object
        const classesPerWeek = {
            monday: parseInt(classesMonday),
            tuesday: parseInt(classesTuesday),
            wednesday: parseInt(classesWednesday),
            thursday: parseInt(classesThursday),
            friday: parseInt(classesFriday),
            saturday: parseInt(classesSaturday)
        };
        
        // Generate schedule if requiredClasses > 0
        const schedule = requiredClasses > 0 ? generateSchedule(requiredClasses, lastDay, classesPerWeek) : [];
        
        // Show result after small delay to allow UI to update
        setTimeout(() => {
            // Reset loading UI
            setLoading(false);
            
            // Display results
            currentPercentageOutput.innerHTML = `<strong>Current Attendance:</strong> ${currentPercentage}%`;
            
            if (currentPercentage >= required) {
                requiredClassesOutput.innerHTML = `<strong>Congratulations!</strong> Your attendance is already meeting the requirement.`;
            } else {
                requiredClassesOutput.innerHTML = `<strong>Required Additional Classes:</strong> ${requiredClasses} more ${requiredClasses === 1 ? 'class' : 'classes'} to reach ${required}%`;
            }
            
            // Display schedule if any
            displaySchedule(schedule);
            
            // Show results
            resultsOutput.style.display = 'block';
            
            // Scroll to results
            resultsOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    } catch (error) {
        console.error('Calculation error:', error);
        setLoading(false);
        showError("An error occurred during calculation. Please try again.");
    }
}

// Function to generate a recommended schedule
function generateSchedule(requiredClasses, lastDayIndex, classesPerWeek) {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const schedule = [];
    
    // Calculate total days until you need to attend all the required classes
    let remainingClasses = requiredClasses;
    let currentDay = (lastDayIndex + 1) % 6; // Start from the next day
    
    // Generate schedule for at most 2 weeks (12 school days)
    for (let i = 0; i < 12 && remainingClasses > 0; i++) {
        const dayName = daysOfWeek[currentDay];
        const dayKey = dayName.toLowerCase();
        const classesToday = classesPerWeek[dayKey];
        
        if (classesToday > 0) {
            const classesToAttend = Math.min(classesToday, remainingClasses);
            if (classesToAttend > 0) {
                schedule.push({
                    day: dayName,
                    classes: classesToAttend
                });
                remainingClasses -= classesToAttend;
            }
        }
        
        currentDay = (currentDay + 1) % 6; // Move to the next day
    }
    
    return schedule;
}

// Set up event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateAttendance);
}); 