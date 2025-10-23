import Image from "next/image";
import Link from "next/link";
import caisLogo from "@/assets/cais_logo.svg";

export function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Logo, Mission Statement, and Newsletter Form */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-12">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={caisLogo}
              alt="CAIS Logo"
              width={96}
              height={96}
              className="h-12 w-auto"
            />
          </Link>
          <div className="flex-1 text-center lg:text-left">
            <h4 className="text-lg font-medium text-white leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Center for AI Safety is a research nonprofit. Our mission is to reduce societal-scale risks from artificial intelligence.
            </h4>
          </div>
          
          {/* Newsletter Form */}
          <div className="flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <form 
                name="wf-form-AI-Safety-Newsletter-Component" 
                data-name="AI Safety Newsletter Component" 
                action="https://safe.ai/newsletter/success" 
                method="get" 
                id="wf-form-AI-Safety-Newsletter-Component"
                aria-label="AI Safety Newsletter Component"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Keep up to date with AI Safety</h2>
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg">
                    <div className="sm:w-2/3">
                      <label htmlFor="Email-3" className="sr-only">Email Address</label>
                      <input 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm" 
                        maxLength={256} 
                        name="Email" 
                        placeholder="Your email address" 
                        type="email" 
                        id="Email-3" 
                        required 
                      />
                    </div>
                    <input 
                      type="submit" 
                      className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer text-sm sm:w-1/3" 
                      value="Submit" 
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-2"></div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="AI-Safety-Newsletter" 
                      id="AI-Safety-Newsletter" 
                      defaultChecked 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">AI Safety Newsletter</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="AI-Frontiers" 
                      id="AI-Frontiers" 
                      defaultChecked 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">AI Frontiers</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="MLS-Newsletter" 
                      id="MLS-Newsletter" 
                      defaultChecked 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">MLS Newsletter</span>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-12"></div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Our Work Column */}
          <div>
            <h5 className="text-white font-medium mb-4">Our Work</h5>
            <div className="space-y-3">
              <Link href="https://www.safe.ai/work" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                View All Work
              </Link>
              <Link href="https://www.safe.ai/work/statement-on-ai-risk" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Statement on AI Risk
              </Link>
              <Link href="https://www.safe.ai/work/field-building" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Field Building
              </Link>
              <Link href="https://www.safe.ai/work/research" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                CAIS Research
              </Link>
              <Link href="https://www.safe.ai/blog" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                CAIS Blog
              </Link>
            </div>
          </div>

          {/* Our Mission Column */}
          <div>
            <h5 className="text-white font-medium mb-4">Our Mission</h5>
            <div className="space-y-3">
              <Link href="https://www.safe.ai/about" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="https://www.safe.ai/about/media" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                CAIS Media
              </Link>
              <Link href="https://www.safe.ai/work/impact-report/2024" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Annual Impact Report
              </Link>
              <Link href="https://www.safe.ai/faq" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Frequently Asked Questions
              </Link>
              <Link href="https://www.safe.ai/ai-risk" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Learn About AI Risk
              </Link>
              <Link href="https://www.safe.ai/terms-of-service" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="https://www.safe.ai/legal" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Get Involved Column */}
          <div>
            <h5 className="text-white font-medium mb-4">Get Involved</h5>
            <div className="space-y-3">
              <Link href="https://www.safe.ai/donate" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Donate
              </Link>
              <Link href="https://www.safe.ai/newsletter" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                CAIS Publications
              </Link>
              <Link href="https://www.safe.ai/contact" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="https://www.safe.ai/careers" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Careers
              </Link>
              
              {/* Email Links */}
              <Link 
                href="mailto:contact@safe.ai" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 25 25" 
                  fill="none" 
                  className="opacity-70 group-hover:opacity-100"
                >
                  <path 
                    d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span>General: contact@safe.ai</span>
              </Link>
              
              <Link 
                href="mailto:media@safe.ai" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 25 25" 
                  fill="none" 
                  className="opacity-70 group-hover:opacity-100"
                >
                  <path 
                    d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Media: media@safe.ai</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link 
              href="https://www.linkedin.com/company/center-for-ai-safety/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M8.67576 7.33393C8.67558 7.68753 8.53446 8.02658 8.28343 8.27649C8.03241 8.5264 7.69204 8.6667 7.33721 8.66652C6.98238 8.66634 6.64216 8.5257 6.39138 8.27554C6.14061 8.02539 5.99982 7.6862 6 7.33259C6.00018 6.97899 6.1413 6.63994 6.39233 6.39003C6.64336 6.14012 6.98372 5.99982 7.33855 6C7.69338 6.00018 8.0336 6.14081 8.28438 6.39097C8.53515 6.64113 8.67594 6.98032 8.67576 7.33393ZM8.7159 9.6538H6.04014V18H8.7159V9.6538ZM12.9436 9.6538H10.2812V18H12.9168V13.6202C12.9168 11.1804 16.1077 10.9537 16.1077 13.6202V18H18.75V12.7136C18.75 8.60052 14.0273 8.75385 12.9168 10.7737L12.9436 9.6538Z" 
                  fill="currentColor"
                />
              </svg>
            </Link>
            
            <Link 
              href="https://x.com/ai_risks" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M18.9014 1.15311H22.5816L14.5415 10.3424L24 22.8469H16.5941L10.7935 15.263L4.15631 22.8469H0.473926L9.07356 13.0179L0 1.15311H7.59394L12.8372 8.0851L18.9014 1.15311ZM17.6098 20.6441H19.649L6.48589 3.24016H4.29759L17.6098 20.6441Z" 
                  fill="currentColor"
                />
              </svg>
            </Link>
            
            <Link 
              href="https://www.youtube.com/channel/UCY_K5gXsXHtuiP8mj3BiWxA/featured" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M4.45835 4.73508C2.97296 4.80867 1.77978 5.97175 1.68338 7.45583C1.59102 8.87769 1.5 10.6272 1.5 12C1.5 13.3728 1.59102 15.1223 1.68338 16.5442C1.77978 18.0283 2.97296 19.1913 4.45835 19.2649C6.60929 19.3715 9.6836 19.5 12 19.5C14.3164 19.5 17.3907 19.3715 19.5417 19.2649C21.027 19.1913 22.2202 18.0283 22.3166 16.5442C22.409 15.1223 22.5 13.3728 22.5 12C22.5 10.6272 22.409 8.87769 22.3166 7.45583C22.2202 5.97175 21.027 4.80867 19.5417 4.73508C17.3907 4.62852 14.3164 4.5 12 4.5C9.6836 4.5 6.60929 4.62852 4.45835 4.73508ZM15.75 12L9.75 15V9L15.75 12Z" 
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © 2025 Center for AI Safety
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
