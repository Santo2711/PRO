document.addEventListener('DOMContentLoaded', function() {
    const addJobForm = document.getElementById('add-job-form');
    const jobsTableBody = document.getElementById('jobs-tbody');
    const recentActivityList = document.getElementById('recent-activity-list');

    let jobs = [];
    let jobIdCounter = 1;
    let activities = [];

    addJobForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const documentType = document.getElementById('document-type').value;
        const pages = parseInt(document.getElementById('pages').value);
        const copies = parseInt(document.getElementById('copies').value);
        const urgency = document.getElementById('urgency').value;

        const newJob = {
            id: jobIdCounter++,
            customerName,
            documentType,
            pages,
            copies,
            urgency,
            status: 'pending',
            createdAt: new Date().toLocaleString()
        };

        jobs.push(newJob);
        addActivity(`New job added for ${customerName}`);
        displayJobs();
        updateDashboard();

        // Reset form
        addJobForm.reset();
    });

    function displayJobs() {
        jobsTableBody.innerHTML = '';

        jobs.forEach(job => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${job.customerName}</td>
                <td>${job.documentType}</td>
                <td>${job.pages}</td>
                <td>${job.copies}</td>
                <td>${job.urgency}</td>
                <td class="status-${job.status}">${job.status}</td>
                <td>
                    <button class="action-btn" onclick="updateStatus(${job.id})">Update Status</button>
                    <button class="action-btn delete-btn" onclick="deleteJob(${job.id})">Delete</button>
                </td>
            `;

            jobsTableBody.appendChild(row);
        });
    }

    function updateDashboard() {
        const totalJobs = jobs.length;
        const pendingJobs = jobs.filter(job => job.status === 'pending').length;
        const inProgressJobs = jobs.filter(job => job.status === 'in-progress').length;
        const completedJobs = jobs.filter(job => job.status === 'completed').length;

        document.getElementById('total-jobs').textContent = totalJobs;
        document.getElementById('pending-jobs').textContent = pendingJobs;
        document.getElementById('in-progress-jobs').textContent = inProgressJobs;
        document.getElementById('completed-jobs').textContent = completedJobs;

        displayRecentActivities();
    }

    function addActivity(activity) {
        activities.unshift({
            text: activity,
            timestamp: new Date().toLocaleString()
        });
        if (activities.length > 10) {
            activities.pop();
        }
    }

    function displayRecentActivities() {
        recentActivityList.innerHTML = '';
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = `${activity.timestamp}: ${activity.text}`;
            recentActivityList.appendChild(li);
        });
    }

    window.updateStatus = function(jobId) {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            const statuses = ['pending', 'in-progress', 'completed'];
            const currentIndex = statuses.indexOf(job.status);
            const newStatus = statuses[(currentIndex + 1) % statuses.length];
            job.status = newStatus;
            addActivity(`Job for ${job.customerName} status updated to ${newStatus}`);
            displayJobs();
            updateDashboard();
        }
    };

    window.deleteJob = function(jobId) {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            jobs = jobs.filter(j => j.id !== jobId);
            addActivity(`Job for ${job.customerName} deleted`);
            displayJobs();
            updateDashboard();
        }
    };

    // Initial display
    displayJobs();
    updateDashboard();
});
