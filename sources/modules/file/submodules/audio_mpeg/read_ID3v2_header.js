sub.read_ID3v2_header = buffer => {
    let view = new Uint8Array(buffer);
    let string = kk.i8ArrayToString(view);

    if (string.substring(0, 3) === 'ID3') {
        let data = {};
        data.version = (new Uint8Array(buffer, 3, 1))[0];

        let flags = kk.i8to2(view[5]);

        data.unsync = !!flags[0];
//      Bit 7 in the 'ID3v2 flags' indicates whether or not
//      unsynchronisation is applied on all frames (see section 6.1
//      for details); a set bit indicates usage.

        data.extended = !!flags[1];
//      The second bit (bit 6) indicates whether or not the header is
//      followed by an extended header. The extended header is described
//      in section 3.2. A set bit indicates the presence of an extended
//      header.

        if (data.version > 2)
            data.exp = !!flags[3];
//          The third bit (bit 5) is used as an 'experimental indicator'. This
//          flag SHALL always be set when the tag is in an experimental stage.

        if (data.version > 3)
            data.footer = !!flags[4];
//          Bit 4 indicates that a footer (section 3.4) is present at the very
//          end of the tag. A set bit indicates the presence of a footer.

        if (data.version <= 4 && flags.substring(4) !== '0000')
            return false;

        data.length = (view => {
            let binary = kk.i8ArrayTo2(view);
            let out = binary.slice(1, 8);
            out += binary.slice(9, 16);
            out += binary.slice(17, 24);
            out += binary.slice(25, 32);
            out = parseInt(out, 2);

            return out;
        })(new Uint8Array(buffer, 6, 4));

        return data;
    } else {
        return false;
    }
}
//
//
//   c - Experimental indicator
//
//     The third bit (bit 5) is used as an 'experimental indicator'. This
//     flag SHALL always be set when the tag is in an experimental stage.
//
//
//   d - Footer present
//
//     Bit 4 indicates that a footer (section 3.4) is present at the very
//     end of the tag. A set bit indicates the presence of a footer.
//
//
//   All the other flags MUST be cleared. If one of these undefined flags
//   are set, the tag might not be readable for a parser that does not
//   know the flags function.
