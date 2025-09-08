// assets/js/app.js
// Main application logic for Capability-Based Coordination Framework

class FrameworkApp {
    constructor() {
        this.atcfCalculator = new ATCFCalculator();
        this.coordinationAssessment = new CoordinationAssessment();
        this.currentDemo = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.loadInitialData();
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('mainNav');
            if (nav) {
                if (window.scrollY > 100) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        });

        this.setupModalHandlers();
        this.setupDemoLaunchers();
    }

    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupModalHandlers() {
        const modal = document.getElementById('demoModal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.onclick = () => {
                if (modal) modal.style.display = 'none';
            };
        }
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    setupDemoLaunchers() {
        const atcfLauncher = document.getElementById('launchCalculator');
        if (atcfLauncher) {
            atcfLauncher.addEventListener('click', () => this.loadATCFDemo());
        }
    }

    loadInitialData() {
        if (!window.FrameworkData) {
            console.error('Framework data not loaded. Please ensure data.js is included.');
            return;
        }

        console.log('Framework application initialized successfully');
        console.log('Available data:', Object.keys(window.FrameworkData));
    }

    loadATCFDemo() {
        const demoContainer = document.getElementById('demoContainer');
        if (!demoContainer) return;

        demoContainer.innerHTML = `
            <h3>ATCF Calculator Demo</h3>
            <div class="demo-interface">
                <div class="input-group">
                    <label>Historical Continuity (HC):</label>
                    <input type="range" id="hc-input" min="0" max="1" step="0.01" value="0.7">
                    <span id="hc-value">0.70</span>
                </div>
                <div class="input-group">
                    <label>Present Integration (PI):</label>
                    <input type="range" id="pi-input" min="0" max="1" step="0.01" value="0.6">
                    <span id="pi-value">0.60</span>
                </div>
                <div class="input-group">
                    <label>Prospective Coherence (PC):</label>
                    <input type="range" id="pc-input" min="0" max="1" step="0.01" value="0.5">
                    <span id="pc-value">0.50</span>
                </div>
                <div class="input-group">
                    <label>Meta-Constructor Capacity (MCC):</label>
                    <input type="range" id="mcc-input" min="0" max="1" step="0.01" value="0.8">
                    <span id="mcc-value">0.80</span>
                </div>
                <div class="result-display">
                    <h4>ATCF Score: <span id="atcf-result">0.675</span></h4>
                    <div class="interpretation" id="interpretation">Good temporal coherence</div>
                </div>
                <div class="sample-data">
                    <h4>Try Sample Agents:</h4>
                    <button onclick="app.loadSampleAgent('agent1')" class="btn btn-secondary">Load Agent 1 (Individualistic)</button>
                    <button onclick="app.loadSampleAgent('agent2')" class="btn btn-secondary">Load Agent 2 (Collectivistic)</button>
                </div>
            </div>
        `;
        
        this.setupATCFDemoListeners();
        this.calculateATCFDemo();
        
        const modal = document.getElementById('demoModal');
        if (modal) modal.style.display = 'block';
    }

    setupATCFDemoListeners() {
        ['hc', 'pi', 'pc', 'mcc'].forEach(component => {
            const input = document.getElementById(`${component}-input`);
            const value = document.getElementById(`${component}-value`);
            if (input && value) {
                input.addEventListener('input', () => {
                    value.textContent = parseFloat(input.value).toFixed(2);
                    this.calculateATCFDemo();
                });
            }
        });
    }

    calculateATCFDemo() {
        const hc = parseFloat(document.getElementById('hc-input')?.value || 0);
        const pi = parseFloat(document.getElementById('pi-input')?.value || 0);
        const pc = parseFloat(document.getElementById('pc-input')?.value || 0);
        const mcc = parseFloat(document.getElementById('mcc-input')?.value || 0);
        
        const atcf = 0.25 * hc + 0.25 * pi + 0.25 * pc + 0.25 * mcc;
        
        const resultElement = document.getElementById('atcf-result');
        if (resultElement) {
            resultElement.textContent = atcf.toFixed(3);
        }
        
        this.updateATCFInterpretation(atcf);
    }

    updateATCFInterpretation(score) {
        const interpretationElement = document.getElementById('interpretation');
        if (!interpretationElement) return;

        let interpretation, color;
        if (score >= 0.8) {
            interpretation = "Excellent temporal coherence";
            color = "#10b981";
        } else if (score >= 0.7) {
            interpretation = "Good temporal coherence";
            color = "#059669";
        } else if (score >= 0.5) {
            interpretation = "Moderate temporal coherence";
            color = "#d97706";
        } else if (score >= 0.3) {
            interpretation = "Low temporal coherence - intervention recommended";
            color = "#dc2626";
        } else {
            interpretation = "Very low temporal coherence - immediate intervention required";
            color = "#991b1b";
        }
        
        interpretationElement.textContent = interpretation;
        interpretationElement.style.color = color;
    }

    loadSampleAgent(agentId) {
        if (!window.FrameworkData?.sampleAgentData?.[agentId]) {
            console.error(`Sample agent ${agentId} not found`);
            return;
        }

        const agent = window.FrameworkData.sampleAgentData[agentId];
        const assessment = this.atcfCalculator.calculateCulturallyAdaptedATCF(agent);
        
        this.updateDemoInputs({
            hc: assessment.components.HC,
            pi: assessment.components.PI,
            pc: assessment.components.PC,
            mcc: assessment.components.MCC
        });

        this.calculateATCFDemo();
        this.displayAgentInfo(agent, assessment);
    }

    updateDemoInputs(components) {
        Object.entries(components).forEach(([component, value]) => {
            const input = document.getElementById(`${component}-input`);
            const display = document.getElementById(`${component}-value`);
            if (input && display) {
                input.value = value.toFixed(2);
                display.textContent = value.toFixed(2);
            }
        });
    }

    displayAgentInfo(agent, assessment) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'agent-info';
        infoDiv.innerHTML = `
            <h5>Agent: ${agent.name}</h5>
            <p><strong>Cultural Background:</strong> ${agent.cultural_background}</p>
            <p><strong>Identity Kernel:</strong> ${agent.identity_kernel.join(', ')}</p>
            <p><strong>Overall ATCF:</strong> ${assessment.total_score.toFixed(3)} (${assessment.interpretation.level})</p>
            <p><strong>Recommendation:</strong> ${assessment.interpretation.recommendation}</p>
        `;
        
        const demoInterface = document.querySelector('.demo-interface');
        const existingInfo = demoInterface.querySelector('.agent-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        demoInterface.appendChild(infoDiv);
    }

    runCoordinationDemo() {
        if (!window.FrameworkData?.sampleAgentData) {
            console.error('Sample agent data not available');
            return;
        }

        const agent1 = window.FrameworkData.sampleAgentData.agent1;
        const agent2 = window.FrameworkData.sampleAgentData.agent2;

        const assessment = this.coordinationAssessment.assessCrossAgentCoordination(
            agent1, agent2, { task: 'collaboration_demo' }
        );

        this.displayCoordinationResults(assessment, agent1, agent2);
    }

    displayCoordinationResults(assessment, agent1, agent2) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'coordination-results';
        resultsDiv.innerHTML = `
            <h4>Coordination Assessment Results</h4>
            <div class="agent-comparison">
                <div class="agent-summary">
                    <h5>${agent1.name} (${agent1.cultural_background})</h5>
                    <p>ATCF: ${assessment.individual_atcf.agent1.total_score.toFixed(3)}</p>
                </div>
                <div class="coordination-arrow">⟷</div>
                <div class="agent-summary">
                    <h5>${agent2.name} (${agent2.cultural_background})</h5>
                    <p>ATCF: ${assessment.individual_atcf.agent2.total_score.toFixed(3)}</p>
                </div>
            </div>
            <div class="coordination-metrics">
                <div class="metric">
                    <strong>Overall Coordination Potential:</strong> ${assessment.coordination_potential.toFixed(3)}
                </div>
                <div class="metric">
                    <strong>PRF Compatibility:</strong> ${assessment.prf_compatibility.toFixed(3)}
                </div>
                <div class="metric">
                    <strong>Capability Overlap:</strong> ${assessment.capability_overlap.toFixed(3)}
                </div>
                <div class="metric">
                    <strong>Cultural Coordination:</strong> ${assessment.cultural_coordination.toFixed(3)}
                </div>
            </div>
            <div class="recommendation">
                <h5>Recommendation:</h5>
                <p><strong>${assessment.recommendation.level}:</strong> ${assessment.recommendation.description}</p>
                <p><strong>Action:</strong> ${assessment.recommendation.action}</p>
            </div>
        `;

        let resultsContainer = document.getElementById('coordination-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'coordination-results';
            document.querySelector('.main-content .container').appendChild(resultsContainer);
        }
        
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(resultsDiv);
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Global demo functions
window.loadATCFDemo = function() {
    if (window.app) {
        window.app.loadATCFDemo();
    }
};

window.loadCoordinationDemo = function() {
    const demoContainer = document.getElementById('demoContainer');
    if (!demoContainer) return;

    demoContainer.innerHTML = `
        <h3>Coordination Assessment Demo</h3>
        <div class="demo-interface">
            <div class="agent-inputs">
                <div class="agent-section">
                    <h4>Agent 1</h4>
                    <div class="input-group">
                        <label>ATCF Score:</label>
                        <input type="range" id="agent1-atcf" min="0" max="1" step="0.01" value="0.75">
                        <span id="agent1-atcf-value">0.75</span>
                    </div>
                    <div class="input-group">
                        <label>Cultural Background:</label>
                        <select id="agent1-culture">
                            <option value="individualistic">Individualistic</option>
                            <option value="collectivistic">Collectivistic</option>
                            <option value="traditional">Traditional</option>
                            <option value="indigenous">Indigenous</option>
                        </select>
                    </div>
                </div>
                
                <div class="agent-section">
                    <h4>Agent 2</h4>
                    <div class="input-group">
                        <label>ATCF Score:</label>
                        <input type="range" id="agent2-atcf" min="0" max="1" step="0.01" value="0.65">
                        <span id="agent2-atcf-value">0.65</span>
                    </div>
                    <div class="input-group">
                        <label>Cultural Background:</label>
                        <select id="agent2-culture">
                            <option value="individualistic">Individualistic</option>
                            <option value="collectivistic" selected>Collectivistic</option>
                            <option value="traditional">Traditional</option>
                            <option value="indigenous">Indigenous</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="result-display">
                <h4>Coordination Potential: <span id="coord-result">0.672</span></h4>
                <div class="interpretation" id="coord-interpretation">Good coordination potential</div>
                <div class="recommendations" id="coord-recommendations">
                    Recommendation: Focus on capability-based coordination protocols
                </div>
            </div>
            
            <div class="sample-coordination">
                <h4>Try Sample Agent Coordination:</h4>
                <button onclick="app.runCoordinationDemo()" class="btn btn-secondary">Assess Sample Agents</button>
            </div>
        </div>
    `;
    
    const calculateCoordination = () => {
        const atcf1 = parseFloat(document.getElementById('agent1-atcf').value);
        const atcf2 = parseFloat(document.getElementById('agent2-atcf').value);
        const culture1 = document.getElementById('agent1-culture').value;
        const culture2 = document.getElementById('agent2-culture').value;
        
        const minATCF = Math.min(atcf1, atcf2);
        const culturalCompatibility = culture1 === culture2 ? 0.9 : 0.7;
        const coordination = 0.6 * minATCF + 0.4 * culturalCompatibility;
        
        document.getElementById('coord-result').textContent = coordination.toFixed(3);
        
        let interpretation, recommendation;
        if (coordination >= 0.8) {
            interpretation = "Excellent coordination potential";
            recommendation = "Proceed with standard coordination protocols";
        } else if (coordination >= 0.7) {
            interpretation = "Good coordination potential";
            recommendation = "Focus on capability-based coordination protocols";
        } else if (coordination >= 0.5) {
            interpretation = "Moderate coordination potential";
            recommendation = "Implement cultural adaptation strategies";
        } else {
            interpretation = "Low coordination potential";
            recommendation = "Intensive capability development recommended";
        }
        
        document.getElementById('coord-interpretation').textContent = interpretation;
        document.getElementById('coord-recommendations').textContent = "Recommendation: " + recommendation;
    };
    
    document.getElementById('agent1-atcf').addEventListener('input', function() {
        document.getElementById('agent1-atcf-value').textContent = parseFloat(this.value).toFixed(2);
        calculateCoordination();
    });
    
    document.getElementById('agent2-atcf').addEventListener('input', function() {
        document.getElementById('agent2-atcf-value').textContent = parseFloat(this.value).toFixed(2);
        calculateCoordination();
    });
    
    document.getElementById('agent1-culture').addEventListener('change', calculateCoordination);
    document.getElementById('agent2-culture').addEventListener('change', calculateCoordination);
    
    calculateCoordination();
    document.getElementById('demoModal').style.display = 'block';
};

window.loadCulturalDemo = function() {
    // Cultural demo placeholder
    alert('Cultural validation demo - feature coming soon!');
};

window.loadTherapeuticDemo = function() {
    // Therapeutic demo placeholder
    alert('Therapeutic assessment demo - feature coming soon!');
};

document.addEventListener('DOMContentLoaded', function() {
    try {
        window.app = new FrameworkApp();
        console.log('Capability-Based Coordination Framework Application initialized');
    } catch (error) {
        console.error('Failed to initialize Framework Application:', error);
    }
});