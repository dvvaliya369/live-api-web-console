/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import { TopicChip } from '../topic-chip/TopicChip';
import './explainer-picker.scss';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';

const EXPLAINER_TOPICS = [
  { emoji: '🏠', label: 'mortgages' },
  { emoji: '🌌', label: 'dark matter' },
  { emoji: '🌋', label: 'volcanoes' },
  { emoji: '🍄', label: 'mycelium networks' },
  { emoji: '🌕', label: 'cryptocurrency' },
  { emoji: '🤖', label: 'machine learning' },
  { emoji: '🍞', label: 'how yeast works' },
  { emoji: '🔮', label: 'quantum physics' },
  { emoji: '👑', label: 'the plot of macbeth' },
  { emoji: '🧬', label: 'DNA' },
  { emoji: '⚫', label: 'black holes' }
];

const EXPLANATION_STYLES = [
  { emoji: '🍳', label: 'a cooking metaphor' },
  { emoji: '⚽', label: 'a sports commentator' },
  { emoji: '🏴‍☠️', label: 'a pirate' },
  { emoji: '⚔️', label: 'a medieval knight' },
  { emoji: '🔬', label: 'a scientist' },
  { emoji: '✍️', label: 'a poet' },
  { emoji: '🔍', label: 'a detective' }
];

const ExplainerPicker: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const { client, connect, connected } = useLiveAPIContext();

  const handleSelection = (type: 'topic' | 'style', label: string) => {
    const setSelected = type === 'topic' ? setSelectedTopic : setSelectedStyle;    
    setSelected(label);

    const newTopic = type === 'topic' ? label : selectedTopic;
    const newStyle = type === 'style' ? label : selectedStyle;
    
    // If we're streaming and have both topic & style, send to model
    if (connected && newTopic && newStyle) {
      client.send([
        {
          text: `Explain ${newTopic} in the style of ${newStyle}. 
          Don't change your style until I ask you to.`,
        },
      ]);
    }
  };

  const handleStart = async () => {
    if (selectedTopic && selectedStyle && !connected) {
      try {
        await connect();
        // Send initial explanation
        client.send([
          {
            text: `Explain ${selectedTopic} in the style of ${selectedStyle}. 
            Don't change your style until I ask you to.`,
          },
        ]);
      } catch (error) {
        console.error("Failed to start streaming:", error);
      }
    }
  };

  return (
    <div className="explainer-picker">
      <h1 className="title">GenExplainer</h1>
      
      <div className="section">
        <h2 className="section-label">Explain:</h2>
        <div className="chips-container">
          {EXPLAINER_TOPICS.map((topic, index) => (
            <TopicChip 
              key={index} 
              {...topic} 
              isSelected={selectedTopic === topic.label}
              onClick={() => handleSelection('topic', topic.label)}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-label">In the style of:</h2>
        <div className="chips-container">
          {EXPLANATION_STYLES.map((style, index) => (
            <TopicChip 
              key={index} 
              {...style} 
              isSelected={selectedStyle === style.label}
              onClick={() => handleSelection('style', style.label)}
            />
          ))}
        </div>
      </div>

      <button 
        className={`start-button ${!connected && selectedTopic && selectedStyle ? 'enabled' : 'disabled'}`}
        onClick={handleStart}
        disabled={connected || !selectedTopic || !selectedStyle}
      >
        <span className="emoji">🔊</span> {connected ? 'Streaming...' : 'Start talking'}
      </button>
    </div>
  );
};

export default ExplainerPicker; 