class  VbriHeaderTable { 

public: 

    int				SampleRate;
    char			VbriSignature[5];
    unsigned int	        VbriVersion;
    float			VbriDelay;
    unsigned int	        VbriQuality;
    unsigned int	        VbriStreamBytes;
    unsigned int	        VbriStreamFrames;
    unsigned int	        VbriTableSize;
    unsigned int	        VbriTableScale;
    unsigned int	        VbriEntryBytes;
    unsigned int	        VbriEntryFrames;
    int		*		VbriTable;
    
} ;

class CVbriHeader{

public: 
  
  CVbriHeader();
  ~CVbriHeader();
  
  int				readVbriHeader(unsigned char *Hbuffer);

  int				seekPointByTime(float EntryTimeInSeconds);
  float				seekTimeByPoint(unsigned int EntryPointInBytes);
  int				seekPointByPercent(float percent);

private:

  int				getSampleRate(unsigned char * buffer);
  int				readFromBuffer ( unsigned char * HBuffer, int length );

  VbriHeaderTable *             VBHeader;

  int				position ;

  enum offset{
    
    BYTE	=		1,
    WORD	=		2,
    DWORD	=		4
    
  };

};
