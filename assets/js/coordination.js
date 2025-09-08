// assets/js/coordination.js
// Coordination Assessment and Team Analysis Tools

class CoordinationAssessment {
    constructor() {
        this.coordinationThreshold = 0.7;
        this.atcfCalculator = new ATCFCalculator();
    }

    assessCrossAgentCoordination(agent1Data, agent2Data, taskContext = {}) {
        const atcf1 = this.atcfCalculator.calculateCulturallyAdaptedATCF(agent1Data);
        const atcf2 = this.atcfCalculator.calculateCulturallyAdaptedATCF(agent2Data);
        
        const prfCompatibility = this.calculatePRFCompatibility(
            agent1Data.broa_data, 
            agent2Data.broa_data
        );
        
        const capabilityOverlap = this.calculateCapabilityOverlap(
            agent1Data.capabilities || [],
            agent2Data.capabilities || []
        );
        
        const culturalCoordination = this.calculateCulturalCoordination(
            agent1Data.cultural_background,
            agent2Data.cultural_background
        );
        
        const coordinationPotential = (
            0.3 * Math.min(atcf1.total_score, atcf2.total_score) +
            0.25 * prfCompatibility +
            0.25 * capabilityOverlap +
            0.2 * culturalCoordination
        );
        
        return {
            coordination_potential: Math.max(0, Math.min(1, coordinationPotential)),
            individual_atcf: { agent1: atcf1, agent2: atcf2 },
            prf_compatibility: prfCompatibility,
            capability_overlap: capabilityOverlap,
            cultural_coordination: culturalCoordination,
            recommendation: this.generateCoordinationRecommendation(coordinationPotential),
            intervention_strategies: this.identifyInterventionStrategies(
                coordinationPotential, prfCompatibility, capabilityOverlap, culturalCoordination
            )
        };
    }

    calculatePRFCompatibility(broa1, broa2) {
        const beliefCompatibility = this.calculateBeliefCompatibility(broa1.beliefs, broa2.beliefs);
        const ruleCompatibility = this.calculateRuleCompatibility(broa1.rules, broa2.rules);
        const ontologyCompatibility = this.calculateOntologyCompatibility(broa1.ontology, broa2.ontology);
        const authenticityCompatibility = this.calculateAuthenticityCompatibility(
            broa1.authenticity, broa2.authenticity
        );
        
        return (beliefCompatibility + ruleCompatibility + ontologyCompatibility + authenticityCompatibility) / 4;
    }

    calculateBeliefCompatibility(beliefs1, beliefs2) {
        if (!beliefs1 || !beliefs2) return 0.5;
        
        const commonBeliefs = Object.keys(beliefs1).filter(key => key in beliefs2);
        if (commonBeliefs.length === 0) return 0.3;
        
        let totalCompatibility = 0;
        for (const belief of commonBeliefs) {
            const diff = Math.abs(beliefs1[belief] - beliefs2[belief]);
            const compatibility = 1 - diff;
            totalCompatibility += compatibility;
        }
        
        return totalCompatibility / commonBeliefs.length;
    }

    calculateRuleCompatibility(rules1, rules2) {
        if (!rules1 || !rules2) return 0.5;
        
        const decisionCompatibility = this.assessDecisionCompatibility(
            rules1.decision_making, rules2.decision_making
        );
        
        const conflictCompatibility = this.assessConflictCompatibility(
            rules1.conflict_resolution, rules2.conflict_resolution
        );
        
        const goalCompatibility = this.assessGoalCompatibility(
            rules1.goal_setting, rules2.goal_setting
        );
        
        return (decisionCompatibility + conflictCompatibility + goalCompatibility) / 3;
    }

    assessDecisionCompatibility(style1, style2) {
        const compatibilityMatrix = {
            'individual_focused': {
                'individual_focused': 0.9,
                'consensus_based': 0.4,
                'hierarchical': 0.3,
                'collaborative': 0.6
            },
            'consensus_based': {
                'individual_focused': 0.4,
                'consensus_based': 0.9,
                'hierarchical': 0.5,
                'collaborative': 0.8
            }
        };
        
        return compatibilityMatrix[style1]?.[style2] || 0.5;
    }

    assessConflictCompatibility(style1, style2) {
        const compatibilityMatrix = {
            'direct_communication': {
                'direct_communication': 0.9,
                'harmony_preservation': 0.3,
                'authority_based': 0.4,
                'mediated_discussion': 0.7
            },
            'harmony_preservation': {
                'direct_communication': 0.3,
                'harmony_preservation': 0.9,
                'authority_based': 0.6,
                'mediated_discussion': 0.8
            }
        };
        
        return compatibilityMatrix[style1]?.[style2] || 0.5;
    }

    assessGoalCompatibility(style1, style2) {
        const compatibilityMatrix = {
            'personal_achievement': {
                'personal_achievement': 0.8,
                'collective_benefit': 0.4,
                'hierarchical_alignment': 0.3,
                'collaborative_outcome': 0.6
            },
            'collective_benefit': {
                'personal_achievement': 0.4,
                'collective_benefit': 0.9,
                'hierarchical_alignment': 0.7,
                'collaborative_outcome': 0.8
            }
        };
        
        return compatibilityMatrix[style1]?.[style2] || 0.5;
    }

    calculateOntologyCompatibility(ontology1, ontology2) {
        if (!ontology1 || !ontology2) return 0.5;
        
        const agencyCompatibility = this.assessAgencyCompatibility(
            ontology1.agency_conception, ontology2.agency_conception
        );
        
        const timeCompatibility = this.assessTimeCompatibility(
            ontology1.time_orientation, ontology2.time_orientation
        );
        
        const relationshipCompatibility = this.assessRelationshipCompatibility(
            ontology1.relationship_model, ontology2.relationship_model
        );
        
        return (agencyCompatibility + timeCompatibility + relationshipCompatibility) / 3;
    }

    assessAgencyCompatibility(agency1, agency2) {
        const compatibilityMatrix = {
            'independent': {
                'independent': 0.9,
                'interdependent': 0.4,
                'hierarchical': 0.3,
                'collective': 0.5
            },
            'interdependent': {
                'independent': 0.4,
                'interdependent': 0.9,
                'hierarchical': 0.6,
                'collective': 0.8
            }
        };
        
        return compatibilityMatrix[agency1]?.[agency2] || 0.5;
    }

    assessTimeCompatibility(time1, time2) {
        const compatibilityMatrix = {
            'future_focused': {
                'future_focused': 0.9,
                'present_focused': 0.6,
                'past_honoring': 0.4,
                'cyclical_continuity': 0.5
            },
            'cyclical_continuity': {
                'future_focused': 0.5,
                'present_focused': 0.8,
                'past_honoring': 0.8,
                'cyclical_continuity': 0.9
            }
        };
        
        return compatibilityMatrix[time1]?.[time2] || 0.5;
    }

    assessRelationshipCompatibility(model1, model2) {
        const compatibilityMatrix = {
            'voluntary_association': {
                'voluntary_association': 0.9,
                'embedded_obligation': 0.3,
                'hierarchical_structure': 0.2,
                'reciprocal_exchange': 0.7
            },
            'embedded_obligation': {
                'voluntary_association': 0.3,
                'embedded_obligation': 0.9,
                'hierarchical_structure': 0.7,
                'reciprocal_exchange': 0.6
            }
        };
        
        return compatibilityMatrix[model1]?.[model2] || 0.5;
    }

    calculateAuthenticityCompatibility(auth1, auth2) {
        if (!auth1 || !auth2) return 0.5;
        
        const kernelOverlap = this.calculateIdentityKernelOverlap(
            auth1.identity_kernel, auth2.identity_kernel
        );
        
        const alignmentSimilarity = Math.abs(auth1.value_alignment - auth2.value_alignment);
        const alignmentCompatibility = 1 - alignmentSimilarity;
        
        const consistencySimilarity = Math.abs(auth1.self_consistency - auth2.self_consistency);
        const consistencyCompatibility = 1 - consistencySimilarity;
        
        return (kernelOverlap + alignmentCompatibility + consistencyCompatibility) / 3;
    }

    calculateIdentityKernelOverlap(kernel1, kernel2) {
        if (!kernel1 || !kernel2 || kernel1.length === 0 || kernel2.length === 0) return 0;
        
        const set1 = new Set(kernel1);
        const set2 = new Set(kernel2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size;
    }

    calculateCapabilityOverlap(capabilities1, capabilities2) {
        if (!capabilities1 || !capabilities2 || capabilities1.length === 0 || capabilities2.length === 0) {
            return 0.3;
        }
        
        const set1 = new Set(capabilities1);
        const set2 = new Set(capabilities2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        const overlapRatio = intersection.size / union.size;
        const complementarityRatio = (union.size - intersection.size) / union.size;
        
        return 0.4 * overlapRatio + 0.6 * Math.min(1, complementarityRatio * 2);
    }

    calculateCulturalCoordination(culture1, culture2) {
        if (!culture1 || !culture2) return 0.5;
        
        if (culture1 === culture2) return 0.8;
        
        const culturalCompatibilityMatrix = {
            'individualistic': {
                'collectivistic': 0.6,
                'indigenous': 0.5,
                'traditional': 0.4
            },
            'collectivistic': {
                'individualistic': 0.6,
                'indigenous': 0.7,
                'traditional': 0.8
            },
            'indigenous': {
                'individualistic': 0.5,
                'collectivistic': 0.7,
                'traditional': 0.6
            },
            'traditional': {
                'individualistic': 0.4,
                'collectivistic': 0.8,
                'indigenous': 0.6
            }
        };
        
        return culturalCompatibilityMatrix[culture1]?.[culture2] || 0.5;
    }

    generateCoordinationRecommendation(coordinationPotential) {
        if (coordinationPotential >= 0.8) {
            return {
                level: 'excellent',
                description: 'Excellent coordination potential',
                action: 'Proceed with standard coordination protocols',
                confidence: 'high'
            };
        } else if (coordinationPotential >= 0.7) {
            return {
                level: 'good',
                description: 'Good coordination potential',
                action: 'Focus on capability-based coordination protocols',
                confidence: 'high'
            };
        } else if (coordinationPotential >= 0.5) {
            return {
                level: 'moderate',
                description: 'Moderate coordination potential',
                action: 'Implement cultural adaptation strategies and ATCF enhancement',
                confidence: 'medium'
            };
        } else if (coordinationPotential >= 0.3) {
            return {
                level: 'low',
                description: 'Low coordination potential',
                action: 'Intensive capability development and cultural bridge-building recommended',
                confidence: 'medium'
            };
        } else {
            return {
                level: 'very_low',
                description: 'Very low coordination potential',
                action: 'Consider alternative partnerships or extensive preparatory work',
                confidence: 'low'
            };
        }
    }

    identifyInterventionStrategies(coordinationPotential, prfCompatibility, capabilityOverlap, culturalCoordination) {
        const strategies = [];

        if (prfCompatibility < 0.6) {
            strategies.push({
                type: 'prf_alignment',
                priority: 'high',
                strategy: 'Implement belief-bridging exercises and rule harmonization protocols',
                timeline: '2-4 weeks',
                expected_improvement: 0.2
            });
        }

        if (capabilityOverlap < 0.5) {
            strategies.push({
                type: 'capability_development',
                priority: 'medium',
                strategy: 'Focus on complementary capability training and cross-skilling',
                timeline: '4-8 weeks',
                expected_improvement: 0.25
            });
        }

        if (culturalCoordination < 0.6) {
            strategies.push({
                type: 'cultural_bridging',
                priority: 'high',
                strategy: 'Implement cultural competency training and adaptation protocols',
                timeline: '3-6 weeks',
                expected_improvement: 0.3
            });
        }

        if (coordinationPotential < 0.5) {
            strategies.push({
                type: 'comprehensive_coordination',
                priority: 'critical',
                strategy: 'Multi-modal coordination enhancement program including ATCF therapy',
                timeline: '8-12 weeks',
                expected_improvement: 0.4
            });
        }

        return strategies.sort((a, b) => {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
}

window.CoordinationAssessment = CoordinationAssessment;