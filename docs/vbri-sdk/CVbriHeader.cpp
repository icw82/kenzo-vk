//---------------------------------------------------------------------------\ 
//
//               (C) copyright Fraunhofer - IIS (2000)
//                        All Rights Reserved
//
//   filename: CVbriHeader.cpp
//             MPEG Layer-3 Audio Decoder
//   author  : Martin Weishart martin.weishart@iis.fhg.de
//   date    : 2000-02-11
//   contents/description: provides functions to read a VBRI header
//                         of a MPEG Layer 3 bitstream encoded 
//                         with variable bitrate using Fraunhofer 
//                         variable bitrate format 
//
//--------------------------------------------------------------------------/



#include "CVbriHeader.h"



//---------------------------------------------------------------------------\ 
//
//   Constructor: set position in buffer to parse and create a 
//                VbriHeaderTable
//
//---------------------------------------------------------------------------/

CVbriHeader::CVbriHeader(){
  position = 0;
  VBHeader = new VbriHeaderTable;
}



//---------------------------------------------------------------------------\ 
//
//   Destructor: delete a VbriHeaderTable and a VbriHeader
//
//---------------------------------------------------------------------------/

CVbriHeader::~CVbriHeader(){
  delete VBHeader->VbriTable;
  delete VBHeader ;
}



//---------------------------------------------------------------------------\  
//
//   Method:   checkheader
//             Reads the header to a struct that has to be stored and is 
//             used in other functions to determine file offsets
//   Input:    buffer containing the first frame
//   Output:   fills struct VbriHeader
//   Return:   0 on success; 1 on error
//
//---------------------------------------------------------------------------/

int CVbriHeader::readVbriHeader(unsigned char *Hbuffer){

  unsigned int i, TableLength ;

  // MPEG header 
  if ( (VBHeader->SampleRate = getSampleRate(Hbuffer)) == 0){
	// error: probably no MPEG header
	return 1;
  }

  position += DWORD ;

  // data indicating silence
  position += (8*DWORD) ;
  
  // if a VBRI Header exists read it

  if ( *(Hbuffer+position  ) == 'V' &&
       *(Hbuffer+position+1) == 'B' &&
       *(Hbuffer+position+2) == 'R' &&
       *(Hbuffer+position+3) == 'I'){
    
    position += DWORD ;
    
    VBHeader->VbriVersion      = readFromBuffer(Hbuffer, WORD);    
    VBHeader->VbriDelay        = readFromBuffer(Hbuffer, WORD);    
    VBHeader->VbriQuality      = readFromBuffer(Hbuffer, WORD);    
    VBHeader->VbriStreamBytes  = readFromBuffer(Hbuffer, DWORD);    
    VBHeader->VbriStreamFrames = readFromBuffer(Hbuffer, DWORD);    
    VBHeader->VbriTableSize    = readFromBuffer(Hbuffer, WORD);    
    VBHeader->VbriTableScale   = readFromBuffer(Hbuffer, WORD);    
    VBHeader->VbriEntryBytes   = readFromBuffer(Hbuffer, WORD);    
    VBHeader->VbriEntryFrames  = readFromBuffer(Hbuffer, WORD);
    
    TableLength = VBHeader->VbriTableSize*VBHeader->VbriEntryBytes;
    
    VBHeader->VbriTable = new int[(const int) VBHeader->VbriTableSize + 1] ;

    for ( i = 0 ; i <= VBHeader->VbriTableSize ; i++){
      VBHeader->VbriTable[i] = readFromBuffer(Hbuffer, VBHeader->VbriEntryBytes*BYTE) 
        * VBHeader->VbriTableScale ;
    }
  }
  else{
    return 1;
  }
  return 0;
}



//---------------------------------------------------------------------------\ 
//
//   Method:   seekPointByTime
//             Returns a point in the file to decode in bytes that is nearest 
//             to a given time in seconds
//   Input:    time in seconds
//   Output:   None
//   Returns:  point belonging to the given time value in bytes
//
//---------------------------------------------------------------------------/

int CVbriHeader::seekPointByTime(float EntryTimeInMilliSeconds){

  unsigned int SamplesPerFrame, i=0, SeekPoint = 0 , fraction = 0;

  float TotalDuration ;
  float DurationPerVbriFrames ;
  float AccumulatedTime = 0.0f ;
 
  (VBHeader->SampleRate >= 32000) ? (SamplesPerFrame = 1152) : (SamplesPerFrame = 576) ;

  TotalDuration		= ((float)VBHeader->VbriStreamFrames * (float)SamplesPerFrame) 
						  / (float)VBHeader->SampleRate * 1000.0f ;
  DurationPerVbriFrames = (float)TotalDuration / (float)(VBHeader->VbriTableSize+1) ;
 
  if ( EntryTimeInMilliSeconds > TotalDuration ) EntryTimeInMilliSeconds = TotalDuration; 
 
  while ( AccumulatedTime <= EntryTimeInMilliSeconds ){
    
    SeekPoint	      += VBHeader->VbriTable[i] ;
    AccumulatedTime += DurationPerVbriFrames;
    i++;
    
  }
  
  // Searched too far; correct result
  fraction = ( (int)(((( AccumulatedTime - EntryTimeInMilliSeconds ) / DurationPerVbriFrames ) 
			 + (1.0f/(2.0f*(float)VBHeader->VbriEntryFrames))) * (float)VBHeader->VbriEntryFrames));

  
  SeekPoint -= (int)((float)VBHeader->VbriTable[i-1] * (float)(fraction) 
				 / (float)VBHeader->VbriEntryFrames) ;

  return SeekPoint ;

}



//---------------------------------------------------------------------------\ 
//
//   Method:   seekTimeByPoint
//             Returns a time in the file to decode in seconds that is 
//             nearest to a given point in bytes
//   Input:    time in seconds
//   Output:   None
//   Returns:  point belonging to the given time value in bytes
//
//---------------------------------------------------------------------------/

float CVbriHeader::seekTimeByPoint(unsigned int EntryPointInBytes){

  unsigned int SamplesPerFrame, i=0, AccumulatedBytes = 0, fraction = 0;

  float SeekTime = 0.0f;
  float TotalDuration ;
  float DurationPerVbriFrames ;

  (VBHeader->SampleRate >= 32000) ? (SamplesPerFrame = 1152) : (SamplesPerFrame = 576) ;

  TotalDuration		= ((float)VBHeader->VbriStreamFrames * (float)SamplesPerFrame) 
						  / (float)VBHeader->SampleRate;
  DurationPerVbriFrames = (float)TotalDuration / (float)(VBHeader->VbriTableSize+1) ;
 
  while (AccumulatedBytes <= EntryPointInBytes){
    
    AccumulatedBytes += VBHeader->VbriTable[i] ;
    SeekTime	       += DurationPerVbriFrames;
    i++;
    
  }
  
  // Searched too far; correct result
  fraction = (int)(((( AccumulatedBytes - EntryPointInBytes ) /  (float)VBHeader->VbriTable[i-1]) 
                    + (1/(2*(float)VBHeader->VbriEntryFrames))) * (float)VBHeader->VbriEntryFrames);
  
  SeekTime -= (DurationPerVbriFrames * (float) ((float)(fraction) / (float)VBHeader->VbriEntryFrames)) ;
 
  return SeekTime ;

}



//---------------------------------------------------------------------------\ 
//
//   Method:   seekPointByPercent
//             Returns a point in the file to decode in bytes that is 
//             nearest to a given percentage of the time of the stream
//   Input:    percent of time
//   Output:   None
//   Returns:  point belonging to the given time percentage value in bytes
//
//---------------------------------------------------------------------------/

int CVbriHeader::seekPointByPercent(float percent){

  int SamplesPerFrame;

  float TotalDuration ;
  
  if (percent >= 100.0f) percent = 100.0f;
  if (percent <= 0.0f)   percent = 0.0f;

  (VBHeader->SampleRate >= 32000) ? (SamplesPerFrame = 1152) : (SamplesPerFrame = 576) ;

  TotalDuration = ((float)VBHeader->VbriStreamFrames * (float)SamplesPerFrame) 
				  / (float)VBHeader->SampleRate;
  
  return seekPointByTime( (percent/100.0f) * TotalDuration * 1000.0f );
  
}



//---------------------------------------------------------------------------\ 
//
//   Method:   GetSampleRate
//             Returns the sampling rate of the file to decode
//   Input:    Buffer containing the part of the first frame after the
//             syncword
//   Output:   None
//   Return:   sampling rate of the file to decode
//
//---------------------------------------------------------------------------/

int CVbriHeader::getSampleRate(unsigned char * buffer){
  
  unsigned char id, idx, mpeg ;
  
  id  = (0xC0 & (buffer[1] << 3)) >> 4;
  idx = (0xC0 & (buffer[2] << 4)) >> 6;
 
  mpeg = id | idx;
  
  switch ((int)mpeg){
    
  case 0 : return 11025;
  case 1 : return 12000;
  case 2 : return 8000;
  case 8 : return 22050;
  case 9 : return 24000;
  case 10: return 16000;
  case 12: return 44100;
  case 13: return 48000;
  case 14: return 32000;
  default: return 0;

  }
}



//---------------------------------------------------------------------------\ 
//
//   Method:   readFromBuffer
//             reads from a buffer a segment to an int value
//   Input:    Buffer containig the first frame
//   Output:   none
//   Return:   number containing int value of buffer segmenet
//             length
//
//---------------------------------------------------------------------------/

int CVbriHeader::readFromBuffer ( unsigned char * HBuffer, int length ){

  int i, b, number = 0;
  
  if (HBuffer){
   
    for( i = 0;  i < length ; i++ ){ 

      b = length-1-i  ;                                                            
      number = number | (unsigned int)( HBuffer[position+i] & 0xff ) << ( 8*b );

    }
    position += length ;
    return number;

  }
  else{
    return 0;
  }
}


