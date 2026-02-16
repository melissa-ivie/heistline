import BlackwaterHeist from '../Missions/BlackwaterHeist';
import AirportObjective from '../Missions/Puzzles/BlackwaterPuzzles/AirportPuzzle/AirportObjective';
import ContaminationReportObjective from '../Missions/Puzzles/BlackwaterPuzzles/ContaminationReportObjective';
import EmailServersObjective from '../Missions/Puzzles/BlackwaterPuzzles/EmailServersObjective';
import FBIObjective from '../Missions/Puzzles/BlackwaterPuzzles/FBIObjective';

import GlassVeilHeist from '../Missions/GlassVeilHeist';
import EmbassyEscape from '../Missions/Puzzles/GlassVeilPuzzles/EmbassyEscapeObjective';
import IdentityWipe from '../Missions/Puzzles/GlassVeilPuzzles/IdentityWipeObjective';
import SmugglerContact from '../Missions/Puzzles/GlassVeilPuzzles/SmugglerContactObjective';
import SurveillanceShutdown from '../Missions/Puzzles/GlassVeilPuzzles/SurveillanceShutdownObjective';

const heists = {
  'Operation Blackwater': {
    title: 'Operation Blackwater',
    isFree: true,
    description: `
      A sleepy town in the Midwest is being slowly poisoned. The megacorp Nexacore Industries has been covertly dumping experimental solvents into the municipal water supply under the guise of agricultural runoff treatment.

        A junior analyst—Eli Marsh—discovered the contamination and attempted to alert federal agencies. Now he's on the move with digital copies of internal toxicology reports.

        Intercepted communications indicate Nexacore is planning to sabotage Eli’s flight before he can deliver the evidence. Your team must move fast.

        Mission Objectives:
        - Prevent the plane from taking off or ensure it lands safely.
        - Recover the original water contamination report from Nexacore’s buried R&D archive.
        - Trace internal communications and extract the CEO’s incriminating email.
        - Deliver the files anonymously to the FDA and FBI without leaving a digital trail.

        Time is running out- and the town doesn’t know it’s dying yet.

    `,
    Component: BlackwaterHeist,
    objectives: [
      {
        id: 'airport',
        title: 'Airport',
        Component: AirportObjective,
        description: 'Prevent the plane from taking off or ensure it lands safely.',
        image: '/images/airport-control.png',
      },
      {
        id: 'contamination-report',
        title: 'Contamination Report',
        Component: ContaminationReportObjective,
        description: 'Recover the original water contamination report from Nexacore’s buried R&D archive.',
        image: '/images/contamination-report.png',
      },
      {
        id: 'email-servers',
        title: 'Email Servers',
        Component: EmailServersObjective,
        description: 'Trace internal communications and extract the CEO’s incriminating email.',
        image: '/images/email-server.png',
      },
      {
        id: 'fbi',
        title: 'FBI',
        Component: FBIObjective,
        description: 'Deliver the files anonymously to the FDA and FBI without leaving a digital trail.',
        image: '/images/fbi.jpg',
      },
    ],
  },

  'The Glass Veil Initiative': {
    title: 'The Glass Veil Initiative',
    isFree: false, 
    description: `
      Dr. Kaia El-Amin was once the youngest advisor to the Unity Council of Arkanis, a rising voice in reform politics. She helped broker peace between rival provinces, pushed legislation for civil oversight of the military, and became a symbol of transparency in a deeply controlled state.
        But after the Council greenlit a covert military campaign in the borderlands, Kaia did something unthinkable. She leaked the classified resolution to the international press. The world saw satellite images of forced evacuations and black sites that the government denied even existed. Her leak halted the operation. It also marked her for capture.
        Declared a traitor by the regime, Kaia is now being hunted by the same political machine she once served. Her citizenship has been revoked. Every airport, every checkpoint, every ID scan is rigged to flag her.
        She reached out to you with a simple request. Not protection. Not revenge. She wants to disappear and start over.

        You have 60 minutes to:

        - Create a new identity with a full backstory and clean citizenship record

        - Infiltrate the Arkanis civil registry and erase her biometric markers

        - Plant evidence of her death during a border crossing

        - Smuggle her across the ocean using diplomatic credentials issued to a different name

    `,
    Component: GlassVeilHeist,
    objectives: [
      {
        id: 'surveillance-shutdown',
        title: 'Surveillance Shutdown',
        Component: SurveillanceShutdown,
        description: 'Disable global facial recognition nodes tracking the target.',
        image: '/images/surveillance.jpg',
      },
      {
        id: 'identity-wipe',
        title: 'Identity Wipe',
        Component: IdentityWipe,
        description: 'Scrub all biometric and identity records from central databases.',
        image: '/images/identity-wipe.png',
      },
      {
        id: 'smuggler-contact',
        title: 'Smuggler Contact',
        Component: SmugglerContact,
        description: 'Locate the extraction smuggler and secure a travel alias.',
        image: '/images/contact.jpg',
      },
      {
        id: 'embassy-escape',
        title: 'Embassy Escape',
        Component: EmbassyEscape,
        description: 'Get the asset across a secure border checkpoint using falsified credentials.',
        image: '/images/embassy-escape.png',
      },
    ],
  },
};

export default heists;
