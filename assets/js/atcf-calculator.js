// assets/js/atcf-calculator.js
// ATCF (Adaptive Temporal Coherence Function) Calculator

class ATCFCalculator {
    constructor(weights = { alpha: 0.25, beta: 0.25, gamma: 0.25, delta: 0.25 }) {
        this.weights = weights;
        this.validateWeights();
        this.temporalDecayConstant = 30; // days
    }

    validateWeights() {
        const sum = Object.values(this.weights).reduce((a, b) => a + b, 0);
        if (Math.abs(sum - 1.0) > 0.001) {
            throw new Error('ATCF weights must sum to 1.0');
        }
    }

    calculateHistoricalContinuity(identityHistory, currentTime) {
        if (!identityHistory || identityHistory.length === 0) return 0;

        let totalScore = 0;
        let totalWeight = 0;

        for (const historyPoint of identityHistory) {
            const timeDiff = (currentTime - historyPoint.timestamp) / (1000 * 60 * 60 * 24); // days
            const temporalWeight = Math.exp(-timeDiff / this.temporalDecayConstant);
            
            const identityPreservation = this.calculateIdentitySimilarity(
                identityHistory[0].identity_kernel,
                historyPoint.identity_kernel
            );
            
            totalScore += temporalWeight * identityPreservation;
            totalWeight += temporalWeight;
        }

        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }

    calculateIdentitySimilarity(kernel1, kernel2) {
        if (!kernel1 || !kernel2 || kernel1.length === 0 || kernel2.length === 0) return 0;
        
        const set1 = new Set(kernel1);
        const set2 = new Set(kernel2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size;
    }

    calculatePresentIntegration(uevData, broaData) {
        const tcfScore = this.calculateTCF(uevData);
        const internalCoherence = this.calculateInternalCoherence(broaData);
        
        return 0.6 * tcfScore + 0.4 * internalCoherence;
    }

    calculateTCF(uevData) {
        const components = [
            uevData.global_feeling_tone,
            uevData.emotional_motivation,
            uevData.rational_deliberation,
            uevData.action_readiness
        ];

        const compatibilityScore = this.checkComponentCompatibility(components);
        const temporalContinuity = this.checkTemporalContinuity(uevData);
        
        return 0.7 * compatibilityScore + 0.3 * temporalContinuity;
    }

    checkComponentCompatibility(components) {
        let totalCompatibility = 0;
        let comparisons = 0;

        for (let i = 0; i < components.length; i++) {
            for (let j = i + 1; j < components.length; j++) {
                const comp1Values = Object.values(components[i]);
                const comp2Values = Object.values(components[j]);
                
                const correlation = this.calculateCorrelation(comp1Values, comp2Values);
                totalCompatibility += Math.abs(correlation);
                comparisons++;
            }
        }

        return comparisons > 0 ? totalCompatibility / comparisons : 0.5;
    }

    calculateCorrelation(arr1, arr2) {
        if (arr1.length !== arr2.length || arr1.length === 0) return 0;

        const mean1 = arr1.reduce((a, b) => a + b) / arr1.length;
        const mean2 = arr2.reduce((a, b) => a + b) / arr2.length;

        let numerator = 0;
        let sumSq1 = 0;
        let sumSq2 = 0;

        for (let i = 0; i < arr1.length; i++) {
            const diff1 = arr1[i] - mean1;
            const diff2 = arr2[i] - mean2;
            numerator += diff1 * diff2;
            sumSq1 += diff1 * diff1;
            sumSq2 += diff2 * diff2;
        }

        const denominator = Math.sqrt(sumSq1 * sumSq2);
        return denominator === 0 ? 0 : numerator / denominator;
    }

    checkTemporalContinuity(uevData) {
        const allValues = Object.values(uevData).flatMap(component => 
            Object.values(component)
        );
        
        const mean = allValues.reduce((a, b) => a + b) / allValues.length;
        const variance = allValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allValues.length;
        
        return Math.max(0, 1 - variance);
    }

    calculateInternalCoherence(broaData) {
        const beliefConsistency = this.calculateBeliefConsistency(broaData.beliefs);
        const ruleCoherence = this.calculateRuleCoherence(broaData.rules);
        const ontologyAlignment = this.calculateOntologyAlignment(broaData.ontology);
        const authenticityAlignment = broaData.authenticity.value_alignment || 0.75;

        return (beliefConsistency + ruleCoherence + ontologyAlignment + authenticityAlignment) / 4;
    }

    calculateBeliefConsistency(beliefs) {
        if (!beliefs) return 0.5;
        
        const values = Object.values(beliefs);
        const mean = values.reduce((a, b) => a + b) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        
        const optimalVariance = 0.1;
        const varianceScore = 1 - Math.abs(variance - optimalVariance);
        
        return Math.max(0, Math.min(1, varianceScore));
    }

    calculateRuleCoherence(rules) {
        if (!rules) return 0.5;
        
        const ruleCount = Object.keys(rules).length;
        return Math.min(1, ruleCount / 5);
    }

    calculateOntologyAlignment(ontology) {
        if (!ontology) return 0.5;
        
        const expectedCategories = ['agency_conception', 'time_orientation', 'relationship_model'];
        const presentCategories = expectedCategories.filter(cat => ontology[cat]);
        
        return presentCategories.length / expectedCategories.length;
    }

    calculateProspectiveCoherence(futureProjections, identityKernel) {
        const projectionAlignment = this.calculateProjectionAlignment(futureProjections, identityKernel);
        const adaptiveCapacity = this.calculateAdaptiveCapacity(futureProjections);
        
        return 0.6 * projectionAlignment + 0.4 * adaptiveCapacity;
    }

    calculateProjectionAlignment(projections, identityKernel) {
        if (!projections.goals || !identityKernel) return 0.5;
        
        const goalKernelOverlap = projections.goals.filter(goal => 
            identityKernel.some(kernelElement => 
                goal.toLowerCase().includes(kernelElement.toLowerCase()) ||
                kernelElement.toLowerCase().includes(goal.toLowerCase())
            )
        ).length;
        
        const alignmentScore = goalKernelOverlap / Math.max(projections.goals.length, 1);
        const explicitAlignment = projections.alignment_with_identity || alignmentScore;
        
        return (alignmentScore + explicitAlignment) / 2;
    }

    calculateAdaptiveCapacity(projections) {
        const goalDiversity = this.calculateGoalDiversity(projections.goals);
        const timelineRealism = this.assessTimelineRealism(projections.timeline);
        
        return (goalDiversity + timelineRealism) / 2;
    }

    calculateGoalDiversity(goals) {
        if (!goals || goals.length === 0) return 0;
        
        const uniqueGoalTypes = new Set(goals.map(goal => goal.split('_')[0])).size;
        const diversityScore = Math.min(1, uniqueGoalTypes / 5);
        
        return diversityScore;
    }

    assessTimelineRealism(timeline) {
        const timelineMap = {
            '1_year': 0.7,
            '3_years': 0.8,
            '5_years': 0.9,
            '10_years': 0.8,
            '20_years': 0.6
        };
        
        return timelineMap[timeline] || 0.5;
    }

    calculateMetaConstructorCapacity(selfModificationData) {
        const modificationAbility = this.assessModificationAbility(selfModificationData);
        const coherenceMaintenance = this.assessCoherenceMaintenance(selfModificationData);
        
        return 0.5 * modificationAbility + 0.5 * coherenceMaintenance;
    }

    assessModificationAbility(modData) {
        if (!modData.modification_history) return 0.3;
        
        const historyLength = modData.modification_history.length;
        const diversityScore = new Set(modData.modification_history.map(mod => 
            mod.split('_')[0]
        )).size;
        
        return Math.min(1, (historyLength * 0.2) + (diversityScore * 0.1));
    }

    assessCoherenceMaintenance(modData) {
        return modData.coherence_maintenance_capacity || 0.5;
    }

    calculateATCF(agentData, timeWindow = { current: Date.now() }) {
        const hc = this.calculateHistoricalContinuity(
            agentData.identity_history,
            timeWindow.current
        );
        
        const pi = this.calculatePresentIntegration(
            agentData.uev_data,
            agentData.broa_data
        );
        
        const pc = this.calculateProspectiveCoherence(
            agentData.future_projections,
            agentData.identity_kernel
        );
        
        const mcc = this.calculateMetaConstructorCapacity(
            agentData.self_modification_data
        );

        const totalScore = (
            this.weights.alpha * hc +
            this.weights.beta * pi +
            this.weights.gamma * pc +
            this.weights.delta * mcc
        );

        return {
            total_score: Math.max(0, Math.min(1, totalScore)),
            components: {
                HC: Math.max(0, Math.min(1, hc)),
                PI: Math.max(0, Math.min(1, pi)),
                PC: Math.max(0, Math.min(1, pc)),
                MCC: Math.max(0, Math.min(1, mcc))
            },
            weights: { ...this.weights },
            assessment_timestamp: timeWindow.current,
            interpretation: this.interpretATCFScore(totalScore)
        };
    }

    interpretATCFScore(score) {
        if (score >= 0.8) {
            return {
                level: 'excellent',
                description: 'Excellent temporal coherence',
                recommendation: 'Maintain current practices and consider mentoring others'
            };
        } else if (score >= 0.7) {
            return {
                level: 'good',
                description: 'Good temporal coherence',
                recommendation: 'Continue current development with minor optimizations'
            };
        } else if (score >= 0.5) {
            return {
                level: 'moderate',
                description: 'Moderate temporal coherence',
                recommendation: 'Focus on strengthening weak components through targeted interventions'
            };
        } else if (score >= 0.3) {
            return {
                level: 'low',
                description: 'Low temporal coherence',
                recommendation: 'Comprehensive intervention recommended - consider temporal coherence therapy'
            };
        } else {
            return {
                level: 'very_low',
                description: 'Very low temporal coherence',
                recommendation: 'Immediate intervention required - consult with trained practitioner'
            };
        }
    }

    adaptForCulture(culturalContext, baseWeights = this.weights) {
        if (!window.FrameworkData?.culturalFrameworks?.[culturalContext]) {
            return baseWeights;
        }

        const cultural = window.FrameworkData.culturalFrameworks[culturalContext];
        const modifiers = cultural.atcf_modifiers;

        const adaptedWeights = {
            alpha: baseWeights.alpha * modifiers.alpha,
            beta: baseWeights.beta * modifiers.beta,
            gamma: baseWeights.gamma * modifiers.gamma,
            delta: baseWeights.delta * modifiers.delta
        };

        const total = Object.values(adaptedWeights).reduce((sum, weight) => sum + weight, 0);
        for (const key in adaptedWeights) {
            adaptedWeights[key] = adaptedWeights[key] / total;
        }

        return adaptedWeights;
    }

    calculateCulturallyAdaptedATCF(agentData, timeWindow = { current: Date.now() }) {
        const culturalContext = agentData.cultural_background;
        const adaptedWeights = this.adaptForCulture(culturalContext);
        
        const originalWeights = { ...this.weights };
        this.weights = adaptedWeights;
        
        const result = this.calculateATCF(agentData, timeWindow);
        result.cultural_adaptation = {
            original_weights: originalWeights,
            adapted_weights: adaptedWeights,
            cultural_context: culturalContext
        };
        
        this.weights = originalWeights;
        
        return result;
    }
}

window.ATCFCalculator = ATCFCalculator;