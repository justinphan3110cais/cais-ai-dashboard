import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Globe, FileText, Copy, Check, Loader, Github } from 'lucide-react';
import Image from 'next/image';
import { Dataset } from '@/lib/types';
import hf_logo from '@/assets/external/hf-logo.svg';

interface DatasetDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: Dataset | null;
}

const DatasetDetailsDialog: React.FC<DatasetDetailsDialogProps> = ({
  isOpen,
  onClose,
  dataset
}) => {
  const [copied, setCopied] = useState(false);
  const [citation, setCitation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || (!dataset?.citationUrl && !dataset?.citation)) {
      setCitation('');
      setLoading(false);
      return;
    }

    // If we have direct citation text, use it
    if (dataset.citation) {
      setCitation(dataset.citation);
      setLoading(false);
      return;
    }

    // Otherwise fetch from URL
    if (dataset.citationUrl) {
      const fetchCitation = async () => {
        try {
          setLoading(true);
          const response = await fetch(dataset.citationUrl!);
          if (!response.ok) {
            throw new Error('Failed to fetch citation');
          }
          const citationText = await response.text();
          setCitation(citationText.trim());
        } catch (err) {
          console.error('Error fetching citation:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchCitation();
    }
  }, [dataset?.citationUrl, dataset?.citation, isOpen, dataset?.id]);

  const handleCopy = () => {
    if (citation) {
      navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!dataset) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[90vw] !max-w-[90vw] max-h-[90vh] overflow-y-auto sm:!max-w-[90vw]">
        <div className="pt-6 space-y-6">
          {/* Header with title and links */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {dataset.title || dataset.name}
            </h2>
            <div className="flex gap-4 mb-6">
              {dataset.paperLink && (
                <a 
                  href={dataset.paperLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-background text-foreground border border-foreground rounded-md hover:bg-foreground hover:text-background transition-colors"
                  title="Paper"
                >
                  <FileText className="w-5 h-5" />
                </a>
              )}
              {dataset.link && (
                <a 
                  href={dataset.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-background text-foreground border border-foreground rounded-md hover:bg-foreground hover:text-background transition-colors"
                  title="Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {dataset.githubLink && (
                <a 
                  href={dataset.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-background text-foreground border border-foreground rounded-md hover:bg-foreground hover:text-background transition-colors"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {dataset.huggingfaceLink && (
                <a 
                  href={dataset.huggingfaceLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-background text-foreground border border-foreground rounded-md hover:bg-foreground hover:text-background transition-colors"
                  title="Dataset"
                >
                  <Image src={hf_logo} alt="Hugging Face Dataset" width={20} height={20} />
                </a>
              )}
            </div>
          </div>
          
          {/* Description and Examples - Responsive Layout */}
          <div className={`grid grid-cols-1 gap-8 ${dataset.examples && dataset.examples.length > 0 ? 'lg:grid-cols-2' : ''}`}>
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <div 
                className="text-gray-700 mb-4" 
                dangerouslySetInnerHTML={{ __html: dataset.description }}
                style={{ lineHeight: '1.6' }}
              />
            </div>

            {/* Examples */}
            {dataset.examples && dataset.examples.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Examples</h3>
                <div className="space-y-6">
                  {dataset.examples.map((example, index) => (
                    <div key={index} className="flex flex-col items-center">
                      {example.alt && (
                        <p className="text-sm text-gray-600 mb-2 font-medium text-center italic">
                          {example.alt}
                        </p>
                      )}
                      {example.type === 'image' ? (
                        <Image
                          src={example.src}
                          alt={example.alt || `${dataset.name} Example ${index + 1}`}
                          className="max-w-full w-auto h-auto rounded-md"
                          width={800}
                          height={600}
                          priority
                        />
                      ) : example.type === 'video' ? (
                        <video
                          src={example.src as string}
                          controls
                          className="max-w-full max-h-96 w-auto h-auto rounded-md"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Citation Section */}
          {(dataset.citationUrl || dataset.citation) && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Citation</h3>
              <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-4">
                {!loading && citation && (
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 hover:bg-gray-200 rounded-md transition-colors"
                    title="Copy citation"
                    disabled={loading}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                )}
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 text-gray-500 animate-spin" />
                    <span className="ml-2 text-gray-500">Loading latest citation...</span>
                  </div>
                ) : null}
                
                {!loading && citation && (
                  <pre className="text-xs text-gray-800 overflow-x-auto overflow-y-auto whitespace-pre-wrap pr-10 max-h-48">
                    {citation}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetDetailsDialog;