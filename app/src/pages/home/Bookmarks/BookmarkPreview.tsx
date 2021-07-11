import React from 'react';
import { Box, Link, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Bookmark } from 'types';
import { DotSeparator, HighlightedText } from '../../common';
import useStyles from './styles';

interface Props {
  bookmark: Bookmark;
  query: string;
}

export default function BookmarkPreview({ bookmark, query }: Props) {
  const classes = useStyles();
  const { i18n } = useTranslation();

  const { metadata } = bookmark;

  return (
    <Box display="flex" padding={1} flex="1">
      <div className={classes.cardImageContainer}>
        <img
          src={metadata.image}
          alt={metadata.title ? `${metadata.title} banner` : ''}
          className={classes.cardImage}
        />
      </div>
      <Box display="flex" flexDirection="column" flex="1">
        <Link
          href={bookmark.url}
          target="_blank"
          rel="noopener"
          className={classes.cardLink}
        >
          <HighlightedText
            // TODO: What to do when there is no title?
            text={metadata.title ?? '<No Title>'}
            query={query}
          />
        </Link>
        {metadata.description && (
          <Typography
            gutterBottom
            variant="caption"
            className={classes.textEllipsis}
          >
            <HighlightedText text={metadata.description} query={query} />
          </Typography>
        )}
        <Box display="flex" className={classes.secondaryText}>
          <Typography
            variant="caption"
            className={classes.urlEllipsis}
            color="textSecondary"
          >
            <HighlightedText text={bookmark.url} query={query} />
          </Typography>
          <DotSeparator />
          <Typography variant="caption" color="textSecondary">
            {new Intl.DateTimeFormat(i18n.language).format(
              new Date(bookmark.createdAt)
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
