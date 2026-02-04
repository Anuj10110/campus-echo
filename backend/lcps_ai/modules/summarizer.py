"""
Document Summarizer using BART model
"""
from transformers import pipeline
import config.settings as settings
from utils.logger import logger
from utils.document_parser import DocumentParser


class Summarizer:
    """Document summarization using BART"""
    
    def __init__(self):
        self.summarizer = None
        logger.info("Initializing summarizer...")
        self._load_model()
    
    def _load_model(self):
        """Load BART summarization model"""
        try:
            logger.info(f"Loading summarization model: {settings.SUMMARIZATION_MODEL}")
            self.summarizer = pipeline(
                "summarization",
                model=settings.SUMMARIZATION_MODEL,
                device=0 if settings.CONVERSATIONAL_MODEL else -1,  # Use GPU if available
                model_kwargs={"cache_dir": str(settings.MODELS_DIR)}
            )
            logger.info("Summarization model loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading summarization model: {e}")
            raise
    
    def summarize_text(self, text: str, max_length: int = 150, min_length: int = 50) -> str:
        """
        Summarize text
        
        Args:
            text: Text to summarize
            max_length: Maximum length of summary
            min_length: Minimum length of summary
        
        Returns:
            Summarized text
        """
        try:
            if not text or len(text.strip()) < 100:
                return "Text is too short to summarize effectively."
            
            # BART has a max input length of 1024 tokens
            # Split text into chunks if necessary
            max_input_length = 1024
            if len(text.split()) > max_input_length:
                # Summarize in chunks
                chunks = self._chunk_text(text, max_input_length)
                summaries = []
                
                for chunk in chunks:
                    summary = self.summarizer(
                        chunk,
                        max_length=max_length // len(chunks) + 50,
                        min_length=min_length // len(chunks),
                        do_sample=False
                    )[0]['summary_text']
                    summaries.append(summary)
                
                # If multiple chunks, summarize the summaries
                if len(summaries) > 1:
                    combined = " ".join(summaries)
                    if len(combined.split()) > max_input_length // 2:
                        final_summary = self.summarizer(
                            combined,
                            max_length=max_length,
                            min_length=min_length,
                            do_sample=False
                        )[0]['summary_text']
                        return final_summary
                
                return " ".join(summaries)
            else:
                # Summarize directly
                summary = self.summarizer(
                    text,
                    max_length=max_length,
                    min_length=min_length,
                    do_sample=False
                )[0]['summary_text']
                return summary
            
        except Exception as e:
            logger.error(f"Error summarizing text: {e}")
            return "Failed to generate summary. The text might be too complex or short."
    
    def summarize_document(self, file_path: str, max_length: int = 150, min_length: int = 50) -> str:
        """
        Summarize a document (PDF or Word)
        
        Args:
            file_path: Path to document
            max_length: Maximum length of summary
            min_length: Minimum length of summary
        
        Returns:
            Summarized text
        """
        try:
            # Parse document
            logger.info(f"Parsing document: {file_path}")
            text = DocumentParser.parse_document(file_path)
            
            if not text:
                return "Failed to extract text from document."
            
            logger.info(f"Extracted {len(text)} characters from document")
            
            # Summarize
            return self.summarize_text(text, max_length, min_length)
            
        except Exception as e:
            logger.error(f"Error summarizing document: {e}")
            return f"Failed to summarize document: {str(e)}"
    
    def _chunk_text(self, text: str, max_words: int) -> list:
        """Split text into chunks of maximum word count"""
        words = text.split()
        chunks = []
        current_chunk = []
        
        for word in words:
            current_chunk.append(word)
            if len(current_chunk) >= max_words:
                chunks.append(" ".join(current_chunk))
                current_chunk = []
        
        # Add remaining words
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks
    
    def get_key_points(self, text: str, num_points: int = 5) -> list:
        """
        Extract key points from text using simple sentence extraction
        
        Args:
            text: Text to analyze
            num_points: Number of key points to extract
        
        Returns:
            List of key sentences
        """
        try:
            # Split into sentences
            import re
            sentences = re.split(r'[.!?]+', text)
            sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
            
            if len(sentences) <= num_points:
                return sentences
            
            # Simple scoring: prefer sentences in the beginning and those with numbers
            scored_sentences = []
            for i, sentence in enumerate(sentences):
                score = 0
                # Position score (earlier is better)
                score += (len(sentences) - i) / len(sentences) * 10
                # Length score (moderate length is better)
                word_count = len(sentence.split())
                if 10 <= word_count <= 30:
                    score += 5
                # Has numbers (might be important fact)
                if re.search(r'\d+', sentence):
                    score += 3
                
                scored_sentences.append((score, sentence))
            
            # Sort by score and return top N
            scored_sentences.sort(reverse=True, key=lambda x: x[0])
            return [s[1] for s in scored_sentences[:num_points]]
            
        except Exception as e:
            logger.error(f"Error extracting key points: {e}")
            return []
