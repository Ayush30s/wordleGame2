function Line({ guess, index }) {
  const tiles = [];
  for (let i = 0; i < 5; i++) {
    tiles.push(
      <div
        key={i}
        id={i + "" + index}
        className="flex justify-center rounded-full shadow-sm shadow-black cursor-text h-[50px] uppercase font-bold w-[50px] p-3 m-1 active:bg-white"
      >
        {guess[i]}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row">{tiles}</div>
    </div>
  );
}

export default Line;