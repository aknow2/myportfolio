import React, { useState, useEffect } from 'react';
import Twitter from './twitter.svg';
import FB from './fb.svg';

const initLines: Line[] = [
  {
    msg: `こんにちは。`
  },
  {
    msg: '三重県津市で働くソフトウェア開発者、金山です。',
  },
  {
    emoji: {
      label: "good",
      content: '👍',
    },
    msg: 'Nextjs Nuxtjs Typescript WebGL Golang'
  },
  {
    emoji: {
      label: "love",
      content: '😍',
    },
    msg: 'XP DDD Geoinformation '
  },
];

interface Line {
  msg: string;
  emoji?: {
    label: string;
    content:string;
  }
}

export default function() {
  const [lines, setLines] = useState<Line[]>([]);
  const [showContact, show] = useState(false);

  useEffect(() => {
    const addLetter = (lineIndex: number, letterIndex: number, accLine: Line[] = []) => () => {
      const dstLine = accLine[lineIndex] ?? { msg: ''};
      const srcLine = initLines[lineIndex];
      if (srcLine === undefined) {
        show(true);
        return;
      }
      if (letterIndex === 0) {
        const newLines = [...accLine];
        if (srcLine.emoji) {
          newLines[lineIndex] = {
            ...dstLine,
            emoji: srcLine.emoji,
          }
          setLines(newLines);
        }
        requestAnimationFrame(addLetter(lineIndex, letterIndex + 1, newLines));
      } else {
        const nextLetter = srcLine.msg[letterIndex - 1]; 
        if (nextLetter) {
          const newlines = [...accLine];
          newlines[lineIndex] = {
            ...dstLine,
            msg: dstLine.msg + nextLetter,
          };
          setLines(newlines);
          requestAnimationFrame(addLetter(lineIndex, letterIndex + 1, newlines));
        } else {
          requestAnimationFrame(addLetter(lineIndex + 1, 0, accLine));
        }
      }
    };
    setTimeout(addLetter(0, 0), 100);
  }, []);

  return <div className="content-card">
    {
      lines.map((line, index ) => {
        return (<p key={index}>
          {
            line.emoji &&
          <span role="img" aria-label={line.emoji.label}>{line.emoji.content}</span>
          }
          {line.msg && line.msg}
        </p>);
      })
    }
    {
      showContact &&
      <div className="contact">
        <div className="sns-container">
          <a href="https://twitter.com/aknow21">
            <img width={64} src={Twitter} alt="twitter" draggable={false} />
          </a>
          <a href="https://www.facebook.com/tomoaki.kanayama.3">
            <img width={64} src={FB} alt="facebook" draggable={false} />
          </a>
        </div>
      </div>
    }
    </div>
};
