import { PrismaClient } from '@prisma/client'
import type { DiveType, DifficultyLevel, CurrentCondition, CertificationLevel } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌊 Seeding diving sites database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@divingsites.com' },
    update: {},
    create: {
      email: 'admin@divingsites.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      bio: 'System administrator and diving enthusiast'
    }
  })

  // Create guide user
  const guidePassword = await bcrypt.hash('guide123', 12)
  const guide = await prisma.user.upsert({
    where: { email: 'guide@divingsites.com' },
    update: {},
    create: {
      email: 'guide@divingsites.com',
      password: guidePassword,
      name: 'Dive Guide',
      role: 'GUIDE',
      bio: 'Professional dive guide with 10+ years experience'
    }
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12)
  await prisma.user.upsert({
    where: { email: 'user@divingsites.com' },
    update: {},
    create: {
      email: 'user@divingsites.com',
      password: userPassword,
      name: 'John Diver',
      role: 'USER',
      bio: 'Recreational diver exploring the underwater world'
    }
  })

  // Create sample dive sites
  const sites = [
    // Caribbean
    {
      name: 'Blue Hole',
      description: 'A spectacular underwater sinkhole with crystal clear water and incredible visibility. Perfect for advanced divers looking for a challenging and rewarding dive.',
      location: 'Belize, Caribbean Sea',
      latitude: 17.3189,
      longitude: -87.5353,
      depthMin: 15,
      depthMax: 40,
      diveType: ['WALL', 'TECHNICAL'] as DiveType[],
      difficulty: 'ADVANCED' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 30,
      visibilityMax: 50,
      temperatureMin: 26,
      temperatureMax: 28,
      requiredCertification: ['ADVANCED', 'TECHNICAL'] as CertificationLevel[],
      marineLife: 'Reef sharks, groupers, angelfish, nurse sharks',
      averageDiveDuration: 45,
      emergencyInfo: 'Nearest chamber: Belize City, 30 minutes by boat',
      createdById: guide.id
    },
    {
      name: 'Palancar Reef',
      description: 'Famous drift dive with stunning coral formations and abundant marine life.',
      location: 'Cozumel, Mexico',
      latitude: 20.3485,
      longitude: -87.0647,
      depthMin: 10,
      depthMax: 30,
      diveType: ['REEF', 'DRIFT'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 25,
      visibilityMax: 45,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Eagle rays, nurse sharks, angelfish, parrotfish',
      averageDiveDuration: 50,
      emergencyInfo: 'Cozumel Medical Center, hyperbaric chamber available',
      createdById: admin.id
    },
    {
      name: 'Blue Corner',
      description: 'World-renowned shark dive with strong currents and incredible pelagic action.',
      location: 'Palau, Micronesia',
      latitude: 7.3000,
      longitude: 134.4667,
      depthMin: 20,
      depthMax: 35,
      diveType: ['WALL', 'DRIFT'] as DiveType[],
      difficulty: 'ADVANCED' as DifficultyLevel,
      currentConditions: 'STRONG' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 40,
      temperatureMin: 27,
      temperatureMax: 30,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Grey reef sharks, whitetip sharks, barracuda, Napoleon wrasse',
      averageDiveDuration: 40,
      emergencyInfo: 'Palau National Hospital, chamber available in Koror',
      createdById: guide.id
    },
    {
      name: 'Cenote Dos Ojos',
      description: 'Crystal clear freshwater cenote with stunning stalactites and limestone formations.',
      location: 'Tulum, Mexico',
      latitude: 20.2239,
      longitude: -87.3847,
      depthMin: 5,
      depthMax: 15,
      diveType: ['CAVE', 'SHORE'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 50,
      visibilityMax: 100,
      temperatureMin: 24,
      temperatureMax: 25,
      requiredCertification: ['OPEN_WATER', 'CAVE'] as CertificationLevel[],
      marineLife: 'Freshwater fish, bats, stalactites formations',
      averageDiveDuration: 45,
      emergencyInfo: 'Tulum Hospital, 15 minutes by car',
      createdById: admin.id
    },
    {
      name: 'Rainbow Reef',
      description: 'Colorful soft coral paradise with excellent macro photography opportunities.',
      location: 'Taveuni, Fiji',
      latitude: -16.8500,
      longitude: 179.9667,
      depthMin: 8,
      depthMax: 25,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 35,
      temperatureMin: 25,
      temperatureMax: 28,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Soft corals, anthias, groupers, reef sharks',
      averageDiveDuration: 55,
      emergencyInfo: 'Taveuni Hospital, boat transfer required',
      createdById: guide.id
    },
    // Pacific
    {
      name: 'Great Barrier Reef - Flynn Reef',
      description: 'World-famous coral reef system with abundant marine life and excellent conditions for all skill levels.',
      location: 'Australia, Queensland',
      latitude: -16.2839,
      longitude: 145.7781,
      depthMin: 5,
      depthMax: 25,
      diveType: ['REEF', 'SHORE'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 40,
      temperatureMin: 22,
      temperatureMax: 26,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Coral trout, parrotfish, Maori wrasse, sea turtles, reef sharks',
      averageDiveDuration: 50,
      emergencyInfo: 'Cairns Hospital, regular boat transfers available',
      createdById: admin.id
    },
    {
      name: 'Manta Point',
      description: 'Famous manta ray cleaning station with regular sightings of these gentle giants.',
      location: 'Nusa Penida, Indonesia',
      latitude: -8.7500,
      longitude: 115.5000,
      depthMin: 12,
      depthMax: 20,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 25,
      temperatureMin: 26,
      temperatureMax: 28,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Manta rays, reef sharks, angelfish, cleaning fish',
      averageDiveDuration: 45,
      emergencyInfo: 'Sanglah Hospital Denpasar, 1 hour by boat and car',
      createdById: admin.id
    },
    {
      name: 'Sipadan Island',
      description: 'World heritage site famous for turtle encounters and dramatic wall diving.',
      location: 'Sabah, Malaysia',
      latitude: 4.1158,
      longitude: 118.6283,
      depthMin: 5,
      depthMax: 600,
      diveType: ['WALL', 'REEF'] as DiveType[],
      difficulty: 'ADVANCED' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 40,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Green turtles, hammerhead sharks, barracuda schools, reef sharks',
      averageDiveDuration: 50,
      emergencyInfo: 'Tawau Hospital, helicopter evacuation available',
      createdById: guide.id
    },
    // Red Sea
    {
      name: 'SS Thistlegorm',
      description: 'Historic WWII wreck dive with incredible artifacts and marine life. One of the best wreck dives in the world.',
      location: 'Egypt, Red Sea',
      latitude: 27.8167,
      longitude: 33.9167,
      depthMin: 16,
      depthMax: 32,
      diveType: ['WRECK', 'BOAT'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 30,
      temperatureMin: 24,
      temperatureMax: 28,
      requiredCertification: ['ADVANCED', 'WRECK'] as CertificationLevel[],
      marineLife: 'Groupers, barracuda, moray eels, coral growth on wreck',
      averageDiveDuration: 40,
      emergencyInfo: 'Sharm El Sheikh, hyperbaric chamber available',
      createdById: guide.id
    },
    {
      name: 'Ras Mohammed',
      description: 'Pristine coral reef with incredible biodiversity at the southern tip of Sinai.',
      location: 'Sharm El Sheikh, Egypt',
      latitude: 27.7333,
      longitude: 34.2667,
      depthMin: 10,
      depthMax: 30,
      diveType: ['REEF', 'WALL'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 40,
      temperatureMin: 22,
      temperatureMax: 28,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Anthias, groupers, moray eels, reef sharks, tuna',
      averageDiveDuration: 50,
      emergencyInfo: 'Sharm El Sheikh International Hospital',
      createdById: admin.id
    },
    {
      name: 'Brother Islands',
      description: 'Remote islands with pristine reefs and excellent shark encounters.',
      location: 'Brothers, Egypt',
      latitude: 26.3500,
      longitude: 35.1000,
      depthMin: 20,
      depthMax: 50,
      diveType: ['WALL', 'TECHNICAL'] as DiveType[],
      difficulty: 'TECHNICAL' as DifficultyLevel,
      currentConditions: 'STRONG' as CurrentCondition,
      visibilityMin: 25,
      visibilityMax: 50,
      temperatureMin: 24,
      temperatureMax: 28,
      requiredCertification: ['TECHNICAL'] as CertificationLevel[],
      marineLife: 'Hammerhead sharks, grey reef sharks, thresher sharks',
      averageDiveDuration: 35,
      emergencyInfo: 'Hurghada Hospital, liveaboard evacuation required',
      createdById: guide.id
    },
    // Indian Ocean
    {
      name: 'North Male Atoll',
      description: 'Classic Maldivian reef diving with excellent visibility and diverse marine life.',
      location: 'Maldives',
      latitude: 4.1755,
      longitude: 73.5093,
      depthMin: 8,
      depthMax: 25,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 40,
      temperatureMin: 27,
      temperatureMax: 30,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Reef sharks, eagle rays, groupers, Napoleon wrasse',
      averageDiveDuration: 50,
      emergencyInfo: 'Male Hospital, seaplane evacuation available',
      createdById: admin.id
    },
    {
      name: 'Aliwal Shoal',
      description: 'Famous for raggedtooth shark aggregations and diverse marine ecosystem.',
      location: 'South Africa, KwaZulu-Natal',
      latitude: -30.1500,
      longitude: 30.8000,
      depthMin: 12,
      depthMax: 27,
      diveType: ['REEF', 'SHORE'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 10,
      visibilityMax: 25,
      temperatureMin: 18,
      temperatureMax: 24,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Raggedtooth sharks, eagle rays, turtles, dolphins',
      averageDiveDuration: 45,
      emergencyInfo: 'Scottburgh Hospital, 20 minutes by car',
      createdById: guide.id
    },
    // Mediterranean
    {
      name: 'Christ of the Abyss',
      description: 'Iconic underwater statue in a protected marine sanctuary.',
      location: 'Portofino, Italy',
      latitude: 44.3000,
      longitude: 9.2167,
      depthMin: 8,
      depthMax: 18,
      diveType: ['SHORE', 'REEF'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 30,
      temperatureMin: 16,
      temperatureMax: 24,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Groupers, bream, octopus, nudibranchs',
      averageDiveDuration: 40,
      emergencyInfo: 'Rapallo Hospital, 15 minutes by car',
      createdById: admin.id
    },
    {
      name: 'Blue Grotto',
      description: 'Famous underwater cave system with stunning blue illumination.',
      location: 'Malta',
      latitude: 35.8167,
      longitude: 14.4500,
      depthMin: 6,
      depthMax: 35,
      diveType: ['CAVE', 'SHORE'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 40,
      temperatureMin: 16,
      temperatureMax: 26,
      requiredCertification: ['ADVANCED', 'CAVE'] as CertificationLevel[],
      marineLife: 'Groupers, bream, octopus, sea horses',
      averageDiveDuration: 35,
      emergencyInfo: 'Mater Dei Hospital, 30 minutes by car',
      createdById: guide.id
    },
    // Atlantic
    {
      name: 'Azores - Princess Alice Bank',
      description: 'Remote seamount with incredible pelagic encounters and large marine life.',
      location: 'Azores, Portugal',
      latitude: 38.0000,
      longitude: -25.0000,
      depthMin: 35,
      depthMax: 60,
      diveType: ['TECHNICAL', 'BOAT'] as DiveType[],
      difficulty: 'TECHNICAL' as DifficultyLevel,
      currentConditions: 'STRONG' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 50,
      temperatureMin: 16,
      temperatureMax: 22,
      requiredCertification: ['TECHNICAL'] as CertificationLevel[],
      marineLife: 'Blue sharks, mako sharks, mobula rays, tuna',
      averageDiveDuration: 30,
      emergencyInfo: 'Hospital do Divino Espírito Santo, helicopter required',
      createdById: guide.id
    },
    {
      name: 'Poor Knights Islands',
      description: 'Marine reserve with diverse subtropical marine life and excellent visibility.',
      location: 'New Zealand',
      latitude: -35.4667,
      longitude: 174.7333,
      depthMin: 5,
      depthMax: 40,
      diveType: ['REEF', 'WALL'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 35,
      temperatureMin: 14,
      temperatureMax: 22,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Stingrays, snapper, groupers, nudibranchs',
      averageDiveDuration: 45,
      emergencyInfo: 'Whangarei Hospital, 1 hour by boat and car',
      createdById: admin.id
    },
    // More Caribbean
    {
      name: 'Devils Grotto',
      description: 'Dramatic underwater cavern system with stunning light effects.',
      location: 'Cayman Islands',
      latitude: 19.3133,
      longitude: -81.2546,
      depthMin: 15,
      depthMax: 25,
      diveType: ['CAVE', 'BOAT'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 25,
      visibilityMax: 40,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['ADVANCED', 'CAVE'] as CertificationLevel[],
      marineLife: 'Tarpon, silversides, groupers, angelfish',
      averageDiveDuration: 40,
      emergencyInfo: 'Cayman Islands Hospital, recompression chamber available',
      createdById: guide.id
    },
    {
      name: 'Stingray City',
      description: 'Interactive shallow water experience with friendly southern stingrays.',
      location: 'Grand Cayman',
      latitude: 19.3500,
      longitude: -81.3833,
      depthMin: 3,
      depthMax: 4,
      diveType: ['SHORE', 'BOAT'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 30,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Southern stingrays, yellowtail snappers, sergeant majors',
      averageDiveDuration: 30,
      emergencyInfo: 'George Town Hospital, 15 minutes by boat',
      createdById: admin.id
    },
    {
      name: 'French Angels',
      description: 'Beautiful coral formations with abundant French angelfish population.',
      location: 'Barbados',
      latitude: 13.1939,
      longitude: -59.5432,
      depthMin: 12,
      depthMax: 22,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 35,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'French angelfish, parrotfish, trumpetfish, sea turtles',
      averageDiveDuration: 50,
      emergencyInfo: 'Queen Elizabeth Hospital, 20 minutes by car',
      createdById: admin.id
    },
    // More Pacific
    {
      name: 'Cathedral Cove',
      description: 'Underwater rock formations creating cathedral-like chambers.',
      location: 'Coromandel Peninsula, New Zealand',
      latitude: -36.8167,
      longitude: 175.7833,
      depthMin: 8,
      depthMax: 18,
      diveType: ['SHORE', 'CAVE'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 10,
      visibilityMax: 20,
      temperatureMin: 12,
      temperatureMax: 20,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Blue cod, snapper, crayfish, kelp forests',
      averageDiveDuration: 35,
      emergencyInfo: 'Thames Hospital, 45 minutes by car',
      createdById: admin.id
    },
    {
      name: 'Molokini Crater',
      description: 'Partially submerged volcanic crater with excellent snorkeling and diving.',
      location: 'Maui, Hawaii',
      latitude: 20.6281,
      longitude: -156.4975,
      depthMin: 3,
      depthMax: 20,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 30,
      visibilityMax: 50,
      temperatureMin: 24,
      temperatureMax: 27,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Yellow tangs, Moorish idols, sea turtles, white tip reef sharks',
      averageDiveDuration: 45,
      emergencyInfo: 'Maui Memorial Medical Center, helicopter evacuation',
      createdById: admin.id
    },
    {
      name: 'Manta Ray Night Dive',
      description: 'Incredible night dive experience with feeding manta rays.',
      location: 'Kona, Hawaii',
      latitude: 19.6500,
      longitude: -155.9667,
      depthMin: 10,
      depthMax: 15,
      diveType: ['REEF', 'NIGHT'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 30,
      temperatureMin: 24,
      temperatureMax: 27,
      requiredCertification: ['OPEN_WATER', 'ADVANCED'] as CertificationLevel[],
      marineLife: 'Manta rays, white tip sharks, moray eels, plankton',
      averageDiveDuration: 40,
      emergencyInfo: 'Kona Community Hospital, 20 minutes by car',
      createdById: guide.id
    },
    // More Southeast Asia
    {
      name: 'Barracuda Point',
      description: 'Famous for massive schools of barracuda creating living walls.',
      location: 'Sipadan, Malaysia',
      latitude: 4.1100,
      longitude: 118.6267,
      depthMin: 15,
      depthMax: 25,
      diveType: ['REEF', 'WALL'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 35,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Barracuda schools, turtles, reef sharks, jackfish',
      averageDiveDuration: 45,
      emergencyInfo: 'Tawau Hospital, helicopter evacuation available',
      createdById: guide.id
    },
    {
      name: 'Richelieu Rock',
      description: 'Pinnacle dive site famous for whale shark encounters and macro life.',
      location: 'Surin Islands, Thailand',
      latitude: 9.4167,
      longitude: 97.8500,
      depthMin: 8,
      depthMax: 35,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 30,
      temperatureMin: 27,
      temperatureMax: 30,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Whale sharks, manta rays, seahorses, ghost pipefish',
      averageDiveDuration: 50,
      emergencyInfo: 'Phuket Hospital, boat and car transfer required',
      createdById: guide.id
    },
    {
      name: 'Anemone City',
      description: 'Incredible concentration of sea anemones with resident clownfish.',
      location: 'Lembeh Strait, Indonesia',
      latitude: 1.4500,
      longitude: 125.2167,
      depthMin: 5,
      depthMax: 15,
      diveType: ['SHORE', 'SHORE'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 8,
      visibilityMax: 15,
      temperatureMin: 27,
      temperatureMax: 29,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Clownfish, frogfish, nudibranchs, octopus',
      averageDiveDuration: 60,
      emergencyInfo: 'Bitung Hospital, 30 minutes by car',
      createdById: admin.id
    },
    // More Advanced Sites
    {
      name: 'Bloody Bay Wall',
      description: 'Dramatic wall dive dropping to over 1000 feet with pristine coral.',
      location: 'Little Cayman',
      latitude: 19.7000,
      longitude: -80.0667,
      depthMin: 18,
      depthMax: 1000,
      diveType: ['WALL', 'BOAT'] as DiveType[],
      difficulty: 'ADVANCED' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 30,
      visibilityMax: 60,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Eagle rays, reef sharks, groupers, pristine coral',
      averageDiveDuration: 45,
      emergencyInfo: 'Little Cayman clinic, evacuation to Grand Cayman',
      createdById: guide.id
    },
    {
      name: 'Blue Holes of Andros',
      description: 'Multiple blue holes offering unique cave diving experiences.',
      location: 'Andros Island, Bahamas',
      latitude: 24.7000,
      longitude: -77.9333,
      depthMin: 20,
      depthMax: 60,
      diveType: ['TECHNICAL', 'CAVE'] as DiveType[],
      difficulty: 'TECHNICAL' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 30,
      visibilityMax: 80,
      temperatureMin: 24,
      temperatureMax: 28,
      requiredCertification: ['TECHNICAL', 'CAVE'] as CertificationLevel[],
      marineLife: 'Unique cave fauna, stalactites, haloclines',
      averageDiveDuration: 35,
      emergencyInfo: 'Nassau Hospital, charter flight required',
      createdById: guide.id
    },
    {
      name: 'Shark Observatory',
      description: 'Dedicated shark observation site with multiple species encounters.',
      location: 'Jupiter, Florida',
      latitude: 26.9342,
      longitude: -80.0948,
      depthMin: 20,
      depthMax: 30,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 25,
      temperatureMin: 22,
      temperatureMax: 28,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Lemon sharks, nurse sharks, bull sharks, goliath groupers',
      averageDiveDuration: 40,
      emergencyInfo: 'Jupiter Medical Center, 15 minutes by car',
      createdById: guide.id
    },
    {
      name: 'The Pinnacles',
      description: 'Underwater mountain peaks rising from the deep ocean floor.',
      location: 'Koh Tao, Thailand',
      latitude: 10.0958,
      longitude: 99.8397,
      depthMin: 16,
      depthMax: 35,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'ADVANCED' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 10,
      visibilityMax: 25,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Whale sharks, bull sharks, groupers, barracuda',
      averageDiveDuration: 45,
      emergencyInfo: 'Koh Samui Hospital, boat and car transfer',
      createdById: guide.id
    },
    // Cold Water Sites
    {
      name: 'Silfra Fissure',
      description: 'Crystal clear glacial water diving between tectonic plates.',
      location: 'Thingvellir, Iceland',
      latitude: 64.2567,
      longitude: -21.1267,
      depthMin: 7,
      depthMax: 18,
      diveType: ['SHORE', 'SHORE'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 80,
      visibilityMax: 120,
      temperatureMin: 2,
      temperatureMax: 4,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Arctic char, unique algae formations, geological features',
      averageDiveDuration: 30,
      emergencyInfo: 'Reykjavik Hospital, 45 minutes by car',
      createdById: admin.id
    },
    {
      name: 'Hornby Island',
      description: 'Pacific Northwest diving with giant Pacific octopus encounters.',
      location: 'British Columbia, Canada',
      latitude: 49.5167,
      longitude: -124.6667,
      depthMin: 8,
      depthMax: 25,
      diveType: ['SHORE', 'REEF'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 10,
      visibilityMax: 20,
      temperatureMin: 8,
      temperatureMax: 14,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Giant Pacific octopus, wolf eels, lingcod, sea stars',
      averageDiveDuration: 40,
      emergencyInfo: 'Comox Valley Hospital, ferry and car required',
      createdById: admin.id
    },
    // Unique Sites
    {
      name: 'Underwater Museum',
      description: 'Artificial reef created with life-sized underwater sculptures.',
      location: 'Cancun, Mexico',
      latitude: 21.1619,
      longitude: -86.8515,
      depthMin: 4,
      depthMax: 8,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 30,
      temperatureMin: 26,
      temperatureMax: 29,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Sculptures with coral growth, angelfish, parrotfish',
      averageDiveDuration: 45,
      emergencyInfo: 'Cancun Hospital, 30 minutes by boat and car',
      createdById: admin.id
    },
    {
      name: 'Truk Lagoon',
      description: 'WWII wreck diving paradise with over 50 intact shipwrecks.',
      location: 'Chuuk, Micronesia',
      latitude: 7.4256,
      longitude: 151.7831,
      depthMin: 15,
      depthMax: 60,
      diveType: ['WRECK', 'TECHNICAL'] as DiveType[],
      difficulty: 'TECHNICAL' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 20,
      visibilityMax: 40,
      temperatureMin: 27,
      temperatureMax: 30,
      requiredCertification: ['TECHNICAL', 'WRECK'] as CertificationLevel[],
      marineLife: 'Coral-covered wrecks, sharks, groupers, historical artifacts',
      averageDiveDuration: 40,
      emergencyInfo: 'Chuuk Hospital, limited facilities',
      createdById: guide.id
    },
    {
      name: 'Lake Malawi',
      description: 'Freshwater lake diving with unique endemic cichlid fish species.',
      location: 'Malawi, Africa',
      latitude: -12.0000,
      longitude: 34.0000,
      depthMin: 5,
      depthMax: 20,
      diveType: ['SHORE', 'SHORE'] as DiveType[],
      difficulty: 'BEGINNER' as DifficultyLevel,
      currentConditions: 'MILD' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 25,
      temperatureMin: 22,
      temperatureMax: 28,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Endemic cichlid fish, catfish, unique freshwater ecosystem',
      averageDiveDuration: 50,
      emergencyInfo: 'Lilongwe Hospital, charter flight required',
      createdById: admin.id
    },
    {
      name: 'Guadalupe Island',
      description: 'Premier great white shark cage diving destination.',
      location: 'Mexico, Pacific',
      latitude: 29.0500,
      longitude: -118.2833,
      depthMin: 15,
      depthMax: 25,
      diveType: ['BOAT', 'BOAT'] as DiveType[],
      difficulty: 'INTERMEDIATE' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 30,
      visibilityMax: 50,
      temperatureMin: 18,
      temperatureMax: 22,
      requiredCertification: ['OPEN_WATER'] as CertificationLevel[],
      marineLife: 'Great white sharks, sea lions, elephant seals',
      averageDiveDuration: 30,
      emergencyInfo: 'Ensenada Hospital, liveaboard evacuation required',
      createdById: guide.id
    },
    {
      name: 'Protea Banks',
      description: 'Thrilling shark diving with multiple species in strong currents.',
      location: 'KwaZulu-Natal, South Africa',
      latitude: -30.9000,
      longitude: 30.3167,
      depthMin: 25,
      depthMax: 35,
      diveType: ['REEF', 'BOAT'] as DiveType[],
      difficulty: 'TECHNICAL' as DifficultyLevel,
      currentConditions: 'STRONG' as CurrentCondition,
      visibilityMin: 8,
      visibilityMax: 20,
      temperatureMin: 16,
      temperatureMax: 24,
      requiredCertification: ['ADVANCED'] as CertificationLevel[],
      marineLife: 'Tiger sharks, bull sharks, hammerheads, zambezi sharks',
      averageDiveDuration: 35,
      emergencyInfo: 'Port Shepstone Hospital, 45 minutes by car',
      createdById: guide.id
    },
    {
      name: 'Yongala Wreck',
      description: 'Historic passenger ship wreck now teeming with marine life.',
      location: 'Queensland, Australia',
      latitude: -19.3000,
      longitude: 147.6167,
      depthMin: 15,
      depthMax: 30,
      diveType: ['WRECK', 'BOAT'] as DiveType[],
      difficulty: 'ADVANCED' as DifficultyLevel,
      currentConditions: 'MODERATE' as CurrentCondition,
      visibilityMin: 15,
      visibilityMax: 30,
      temperatureMin: 22,
      temperatureMax: 27,
      requiredCertification: ['ADVANCED', 'WRECK'] as CertificationLevel[],
      marineLife: 'Sea snakes, eagle rays, trevally, coral trout, turtles',
      averageDiveDuration: 40,
      emergencyInfo: 'Townsville Hospital, helicopter evacuation available',
      createdById: guide.id
    }
  ]

  for (const site of sites) {
    const existingSite = await prisma.diveSite.findFirst({
      where: { name: site.name }
    })
    
    if (!existingSite) {
      await prisma.diveSite.create({
        data: site
      })
    }
  }

  // Add sample reviews with 10-star ratings
  console.log('📝 Adding sample reviews...')
  
  // Get some dive sites to add reviews to
  const diveSites = await prisma.diveSite.findMany({
    take: 5
  })
  
  // Get the regular user for reviews
  const user = await prisma.user.findUnique({
    where: { email: 'user@divingsites.com' }
  })
  
  if (user && diveSites.length > 0) {
    const sampleReviews = [
      {
        rating: 9,
        title: 'Incredible visibility!',
        content: 'This dive site exceeded all my expectations. The marine life was abundant and the visibility was crystal clear at 30+ meters. Saw several eagle rays and a variety of tropical fish. Perfect for underwater photography. The drift was manageable and the guide was excellent.',
        diveSiteId: diveSites[0].id,
        userId: user.id
      },
      {
        rating: 8,
        title: 'Great wreck dive',
        content: 'Amazing wreck penetration dive. The structure is well-preserved and safe to explore. Lots of marine life has made this wreck their home. Some swim-throughs require advanced certification but worth it. Water temperature was perfect.',
        diveSiteId: diveSites[1].id,
        userId: guide.id
      },
      {
        rating: 7,
        title: 'Good for beginners',
        content: 'Nice shallow reef dive perfect for new divers. Easy entry from the beach and calm conditions. Saw lots of colorful fish and some small reef sharks. Good for building confidence. Would recommend for Open Water certified divers.',
        diveSiteId: diveSites[2].id,
        userId: user.id
      },
      {
        rating: 10,
        title: 'World-class diving!',
        content: 'Absolutely spectacular! This is hands down one of the best dive sites I have ever experienced. The biodiversity is incredible - manta rays, whale sharks, and pristine coral formations. This site deserves its reputation as a world-class destination.',
        diveSiteId: diveSites[3].id,
        userId: admin.id
      }
    ]
    
    for (const review of sampleReviews) {
      // Check if review already exists
      const existing = await prisma.review.findUnique({
        where: {
          userId_diveSiteId: {
            userId: review.userId,
            diveSiteId: review.diveSiteId
          }
        }
      })
      
      if (!existing) {
        await prisma.review.create({
          data: review
        })
      }
    }
  }

  // Add marine life data
  console.log('🐠 Adding marine life...')
  
  const marineLifeData = [
    // Fishes
    { name: 'Clownfish', latinName: 'Amphiprioninae', type: 'FISH' as const, description: 'Colorful reef fish living in anemones' },
    { name: 'Blue Tang', latinName: 'Paracanthurus hepatus', type: 'FISH' as const, description: 'Bright blue tropical fish with black pattern' },
    { name: 'Angelfish', latinName: 'Pomacanthidae', type: 'FISH' as const, description: 'Beautiful tropical fish with vibrant patterns' },
    { name: 'Butterflyfish', latinName: 'Chaetodontidae', type: 'FISH' as const, description: 'Colorful disk-shaped reef fish' },
    { name: 'Parrotfish', latinName: 'Scaridae', type: 'FISH' as const, description: 'Large colorful fish that eat coral' },
    { name: 'Grouper', latinName: 'Epinephelinae', type: 'FISH' as const, description: 'Large predatory fish, often curious about divers' },
    { name: 'Manta Ray', latinName: 'Mobula birostris', type: 'FISH' as const, description: 'Giant graceful ray, filter feeder' },
    { name: 'Whale Shark', latinName: 'Rhincodon typus', type: 'FISH' as const, description: 'Largest fish in the ocean, gentle giant' },
    { name: 'Reef Shark', latinName: 'Carcharhinus', type: 'FISH' as const, description: 'Medium-sized sharks common on reefs' },
    { name: 'Moray Eel', latinName: 'Muraenidae', type: 'FISH' as const, description: 'Elongated fish living in reef crevices' },
    { name: 'Triggerfish', latinName: 'Balistidae', type: 'FISH' as const, description: 'Aggressive territorial fish with strong teeth' },
    { name: 'Surgeonfish', latinName: 'Acanthuridae', type: 'FISH' as const, description: 'Fish with sharp spines near tail' },
    
    // Marine Plants
    { name: 'Sea Kelp', latinName: 'Laminariales', type: 'PLANT' as const, description: 'Large brown seaweed forming underwater forests' },
    { name: 'Sea Grass', latinName: 'Zostera marina', type: 'PLANT' as const, description: 'Flowering underwater plants in sandy areas' },
    { name: 'Sea Lettuce', latinName: 'Ulva lactuca', type: 'PLANT' as const, description: 'Thin green seaweed resembling lettuce' },
    { name: 'Coralline Algae', latinName: 'Corallinaceae', type: 'PLANT' as const, description: 'Hard calcareous algae that builds reef structure' },
    { name: 'Sargassum', latinName: 'Sargassum', type: 'PLANT' as const, description: 'Brown seaweed with gas-filled bladders' },
    { name: 'Sea Palm', latinName: 'Postelsia palmaeformis', type: 'PLANT' as const, description: 'Brown seaweed resembling a palm tree' },
    
    // Corals
    { name: 'Brain Coral', latinName: 'Diploria', type: 'CORAL' as const, description: 'Large round coral resembling a brain' },
    { name: 'Staghorn Coral', latinName: 'Acropora cervicornis', type: 'CORAL' as const, description: 'Fast-growing branching coral' }
  ]
  
  for (const marineLife of marineLifeData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (prisma as any).marineLife.findFirst({
      where: { name: marineLife.name }
    })
    
    if (!existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).marineLife.create({
        data: marineLife
      })
    }
  }

  // Associate marine life with dive sites
  console.log('🔗 Associating marine life with dive sites...')
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allMarineLife = await (prisma as any).marineLife.findMany()
  const allDiveSites = await prisma.diveSite.findMany()
  
  // Add some random associations
  for (const diveSite of allDiveSites.slice(0, 10)) { // First 10 sites
    // Randomly select 3-8 marine life species per site
    const numSpecies = Math.floor(Math.random() * 6) + 3
    const selectedSpecies = allMarineLife
      .sort(() => 0.5 - Math.random())
      .slice(0, numSpecies)
    
    for (const species of selectedSpecies) {
      // Check if association already exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = await (prisma as any).diveSiteMarineLife.findUnique({
        where: {
          diveSiteId_marineLifeId: {
            diveSiteId: diveSite.id,
            marineLifeId: species.id
          }
        }
      })
      
      if (!existing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).diveSiteMarineLife.create({
          data: {
            diveSiteId: diveSite.id,
            marineLifeId: species.id
          }
        })
      }
    }
  }

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('🔑 Test accounts created:')
  console.log('Admin: admin@divingsites.com / admin123')
  console.log('Guide: guide@divingsites.com / guide123') 
  console.log('User:  user@divingsites.com / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
