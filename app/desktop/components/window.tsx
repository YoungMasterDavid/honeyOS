import React, {Dispatch, useEffect, useRef, useState} from 'react';

interface WindowProps {
  name: string;
  children: React.ReactNode;
  setOpenedWindows:  Dispatch<React.JSX.Element[]>;
  windowIndex: number;
  openedWindows: React.JSX.Element[];
  // onClose: () => void;
  // onMinimize: () => void;
}

export default function WindowScreen({ name, children, setOpenedWindows, openedWindows, windowIndex}: WindowProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [/* onClose */]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };
  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const closeThisWindow = () => {
    setOpenedWindows(openedWindows.filter((_, index) => index !== windowIndex));
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="outline-none"
      id={`window-${windowIndex}`}
      style={{
        position: 'absolute',
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 0: `${position.y}px`,
        display: isMinimized ? 'none' : 'block',
        pointerEvents: isMinimized ? 'none' : 'auto',
        transition: 'opacity 0.2s, height 0.2s',
      }}
    >
    <div
      className="modal-box bg-white text-black p-0 rounded-md m-0 border-primary border-2 relative"
      style={{
        minWidth: isMaximized ? '100vw' : 'auto',
        minHeight: isMaximized ? '100vh' : '50vh',
      }}
    >
      <div className="overflow-auto relative" style={{
        minHeight: isMaximized ? '95vh' : '45vh',
      }}>
        {children}
      </div>
      <div className="flex justify-between items-center text-white modal-action bg-primary absolute bottom-0 w-full h-[5vh] select-none" onMouseDown={handleMouseDown}>
        <span className="pl-[1vw]">{name}</span>
        <div className="flex space-x-2 items-center pr-[1vw] text-black">
          <button className="w-[3vh] h-[3vh] rounded-full bg-green-700" onClick={() => {setIsMinimized(true)}}>
            -
          </button>
          <button className="w-[3vh] h-[3vh] rounded-full bg-yellow-300" onClick={() => {setIsMaximized(true)}}>
            o
          </button>
          <button className="w-[3vh] h-[3vh] rounded-full bg-red-700" onClick={closeThisWindow}>
            x
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}