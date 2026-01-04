'use client';
import { rajasthanForests } from '../data/rajasthan-forests';

const ForestSelector = ({ selectedForest, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Forest Area</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a Protected Area
          </label>
          <select
            value={selectedForest?.id || ''}
            onChange={(e) => {
              const forest = rajasthanForests.find(f => f.id === e.target.value);
              onSelect(forest);
            }}
            className="block w-full text-base border border-gray-300 focus:outline-none focus:ring-fire-500 focus:border-fire-500 sm:text-sm rounded-md p-3"
          >
            <option value="">-- Select a Forest --</option>
            {rajasthanForests.map((forest) => (
              <option key={forest.id} value={forest.id}>
                {forest.name} ({forest.location})
              </option>
            ))}
          </select>
        </div>

        {selectedForest && (
          <div className="mt-4 bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-bold text-orange-800 mb-2">{selectedForest.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 block">Area:</span>
                <span className="font-semibold text-gray-900">{selectedForest.area}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Forest Type:</span>
                <span className="font-semibold text-gray-900">{selectedForest.type}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Key Wildlife:</span>
                <span className="font-semibold text-gray-900">{selectedForest.wildlife.slice(0, 3).join(", ")}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Fire Season:</span>
                <span className="font-semibold text-gray-900">{selectedForest.climate.fireSeason}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForestSelector;
