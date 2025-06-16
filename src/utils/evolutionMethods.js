export const getEvolutionMethod = (details) => {
  if (!details) return '';

  const {
    min_level,
    item,
    trigger,
    min_happiness,
    time_of_day,
    min_beauty,
    min_affection,
    needs_overworld_rain,
    trade_species,
    held_item,
    known_move_type
  } = details;

  if (min_level) {
    return `Level ${min_level}`;
  }

  if (item) {
    return `Use ${item.name.replace('-', ' ')}`;
  }

  if (trigger?.name === 'trade') {
    if (held_item) {
      return `Trade holding ${held_item.name.replace('-', ' ')}`;
    }
    return 'Trade';
  }

  if (min_happiness) {
    let method = 'High Friendship';
    if (time_of_day) {
      method += ` during ${time_of_day}`;
    }
    return method;
  }

  if (min_beauty) {
    return 'High Beauty';
  }

  if (min_affection) {
    return 'High Affection';
  }

  if (needs_overworld_rain) {
    return 'Level up during rain';
  }

  if (known_move_type) {
    return `Know ${known_move_type.name} move`;
  }

  return trigger?.name.replace('-', ' ') || '';
};