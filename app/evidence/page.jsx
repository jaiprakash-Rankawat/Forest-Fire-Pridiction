import { evidence } from '../data/evidence';
import EvidenceCard from '../components/EvidenceCard';

export const metadata = {
  title: 'Case Studies & Evidence | Forest Fire Prediction',
  description: 'Real-world forest fire incidents documented with detailed analysis of causes, impacts, and lessons learned.',
};

export default function EvidencePage() {
  const groupedEvidence = evidence.reduce((acc, caseStudy) => {
    if (!acc[caseStudy.causeName]) {
      acc[caseStudy.causeName] = [];
    }
    acc[caseStudy.causeName].push(caseStudy);
    return acc;
  }, {});

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            📚 Real-World Fire Evidence
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Documented case studies of major forest fires, organized by their primary causes. 
            Each case includes detailed information about how specific conditions led to devastating fires, 
            backed by official investigations and research.
          </p>
        </div>

        <div className="mb-8 bg-orange-50 border border-orange-300 rounded-lg p-6">
          <p className="text-gray-700">
            <strong>Note:</strong> These case studies are based on official fire investigation reports, 
            peer-reviewed research, and credible news sources. They demonstrate how the theoretical causes 
            discussed on our home page manifest in real-world disasters.
          </p>
        </div>

        {Object.entries(groupedEvidence).map(([causeName, cases]) => (
          <div key={causeName} className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-4 border-fire-500">
              {causeName}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {cases.map((caseStudy) => (
                <EvidenceCard key={caseStudy.id} caseStudy={caseStudy} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Sources & Methodology</h3>
          <p className="text-gray-700 mb-4">
            All case studies on this page are compiled from official sources including:
          </p>
          <ul className="space-y-1 text-gray-700 ml-6 list-disc">
            <li>Cal Fire and U.S. Forest Service investigation reports</li>
            <li>NASA Earth Observatory and NOAA climate data</li>
            <li>National Interagency Fire Center (NIFC) records</li>
            <li>Peer-reviewed scientific journals</li>
            <li>Government inquiry reports (e.g., Australian Royal Commission)</li>
            <li>Reputable news organizations with verified facts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
